/// <reference types="vite/client" />
/// <reference types="@types/google.maps" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
