/* ─── Web Audio 녹음 유틸리티 ─── */

export interface RecordingResult {
  blob: Blob;
  base64: string;
  mimeType: string;
  duration: number;
}

/** 브라우저가 지원하는 최적의 MIME 타입을 감지 */
function getPreferredMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

/** Blob → base64 문자열 변환 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** base64 → Blob 변환 (재생용) */
export function base64ToBlob(base64: string): Blob {
  const [header, data] = base64.split(",");
  const mimeMatch = header.match(/data:(.+?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "audio/webm";
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startTime = 0;
  private analyserNode: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;

  /** 마이크 사용 권한 요청 */
  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch {
      return false;
    }
  }

  /** 녹음 시작 */
  async start(
    onDataAvailable?: (analyser: AnalyserNode) => void,
  ): Promise<void> {
    this.chunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 파형 분석용 AudioContext
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;
    source.connect(this.analyserNode);

    if (onDataAvailable && this.analyserNode) {
      onDataAvailable(this.analyserNode);
    }

    const mimeType = getPreferredMimeType();
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: mimeType || undefined,
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };

    this.startTime = Date.now();
    this.mediaRecorder.start(100); // 100ms 단위 청크
  }

  /** 녹음 중지 → 결과 반환 */
  stop(): Promise<RecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("녹음 중이 아닙니다"));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const duration = Math.round((Date.now() - this.startTime) / 1000);
        const mimeType =
          this.mediaRecorder?.mimeType || "audio/webm";
        const blob = new Blob(this.chunks, { type: mimeType });
        const base64 = await blobToBase64(blob);

        // 리소스 정리
        this.cleanup();

        resolve({ blob, base64, mimeType, duration });
      };

      this.mediaRecorder.stop();
    });
  }

  /** 녹음 취소 */
  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }

  /** 녹음 중 여부 */
  get isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  /** 경과 시간 (초) */
  get elapsed(): number {
    if (!this.startTime) return 0;
    return Math.round((Date.now() - this.startTime) / 1000);
  }

  /** AnalyserNode 반환 (파형 시각화용) */
  get analyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  private cleanup(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.audioContext?.close();
    this.audioContext = null;
    this.analyserNode = null;
    this.mediaRecorder = null;
    this.chunks = [];
    this.startTime = 0;
  }
}
