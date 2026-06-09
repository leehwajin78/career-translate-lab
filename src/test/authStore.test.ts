import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store/authStore";

describe("authStore - updateMember", () => {
  beforeEach(() => {
    // Reset state before each test
    const store = useAuthStore.getState();
    // Remove all members except default or clean them up
    // For testing, let's login as null and clear custom members if needed
    useAuthStore.setState({
      currentMember: null,
      members: [
        {
          id: "test-member-id",
          name: "테스터",
          email: "test@example.com",
          password: "password123",
          productKey: "diagnosis",
          createdAt: new Date().toISOString(),
        }
      ]
    });
  });

  it("should update member information in members array", () => {
    const { updateMember } = useAuthStore.getState();

    updateMember("test-member-id", {
      name: "홍길동",
      productKey: "build"
    });

    const updatedMember = useAuthStore.getState().members.find(m => m.id === "test-member-id");
    expect(updatedMember).toBeDefined();
    expect(updatedMember?.name).toBe("홍길동");
    expect(updatedMember?.productKey).toBe("build");
    expect(updatedMember?.email).toBe("test@example.com"); // Remains unchanged
  });

  it("should update currentMember if the updated member is currently logged in", () => {
    const { login, updateMember } = useAuthStore.getState();

    // Login first
    const loggedIn = login("test@example.com", "password123");
    expect(loggedIn).not.toBeNull();
    expect(useAuthStore.getState().currentMember).not.toBeNull();
    expect(useAuthStore.getState().currentMember?.name).toBe("테스터");

    // Update
    updateMember("test-member-id", {
      name: "새로운테스터",
      password: "newpassword"
    });

    const state = useAuthStore.getState();
    expect(state.currentMember?.name).toBe("새로운테스터");
    expect(state.currentMember?.password).toBe("newpassword");

    // The members array is also updated
    const memberInList = state.members.find(m => m.id === "test-member-id");
    expect(memberInList?.name).toBe("새로운테스터");
  });
});
