graph TD
    %% App Entry & Routing
    Root["App.tsx"] --> Providers["Providers<br>(QueryClient, Toaster, etc.)"]
    Providers --> Router["BrowserRouter > Routes"]
    
    %% Routes mapping
    Router --> RouteHome["Route: /"]
    Router --> RouteDiag["Route: /diagnosis"]
    Router --> RouteResult["Route: /result"]
    Router --> RouteConsult["Route: /consultation"]
    Router --> RouteAdmin["Route: /admin"]
    Router --> Route404["Route: *"]
    
    %% Pages
    RouteHome --> IndexPage["pages/Index.tsx"]
    RouteDiag --> DiagPage["pages/Diagnosis.tsx"]
    RouteResult --> ResultPage["pages/Result.tsx"]
    RouteConsult --> ConsultPage["pages/Consultation.tsx"]
    RouteAdmin --> AdminPage["pages/Admin.tsx"]
    Route404 --> NotFoundPage["pages/NotFound.tsx"]

    %% Shared Site Components
    Nav["components/site/Nav.tsx"]
    Footer["components/site/Footer.tsx"]
    
    %% Linking Pages to Nav/Footer
    IndexPage --> Nav
    IndexPage --> Footer
    DiagPage --> Nav
    DiagPage --> Footer
    ResultPage --> Nav
    ResultPage --> Footer
    ConsultPage --> Nav
    ConsultPage --> Footer
    AdminPage --> Nav
    AdminPage --> Footer

    %% Specific Site Components
    CTAButton["components/site/CTAButton.tsx"]
    Editorial["components/site/Editorial.tsx<br>(EditorialCard, GoldDivider, etc.)"]
    
    IndexPage --> CTAButton
    IndexPage --> Editorial
    ResultPage --> CTAButton
    ResultPage --> Editorial
    ConsultPage --> Editorial

    %% UI Components (shadcn)
    ShadcnUI["components/ui/*<br>(Input, Textarea, Select, etc.)"]
    DiagPage -.-> ShadcnUI
    ConsultPage -.-> ShadcnUI
    AdminPage -.-> ShadcnUI

    %% State Management (Zustand)
    StoreDiag[("store/diagnostic.ts")]
    StoreLeads[("store/leads.ts")]
    
    DiagPage -.-> StoreDiag
    ResultPage -.-> StoreDiag
    ConsultPage -.-> StoreDiag
    
    ConsultPage -.-> StoreLeads
    AdminPage -.-> StoreLeads
    
    classDef page fill:#0d1117,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef comp fill:#1f2937,stroke:#9ca3af,stroke-width:1px,color:#fff
    classDef store fill:#4b5563,stroke:#10b981,stroke-width:2px,color:#fff
    
    class IndexPage,DiagPage,ResultPage,ConsultPage,AdminPage,NotFoundPage page
    class Nav,Footer,CTAButton,Editorial,ShadcnUI comp
    class StoreDiag,StoreLeads store
