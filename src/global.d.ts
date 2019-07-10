declare module '*.scss' {
  const styles: any;
  export = styles;
}

declare module 'raf' {
  const raf: any;
  export = raf;
}

declare module 'console' {
  export = typeof import("console");
}