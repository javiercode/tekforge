- cuando lo subi al repositirio en la seccion de build-and-deploy fallo por el siguiente mensaje, justo en build:
Run npm run build

> tekforge@0.1.0 build
> craco build && node -e "require('fs').copyFileSync('build/index.html', 'build/404.html')"

Creating an optimized production build...

Treating warnings as errors because process.env.CI = true.
Most CI servers set it automatically.

Failed to compile.

[eslint] 
src/components/UrlShortener.tsx
  Line 89:6:  React Hook useEffect has a missing dependency: 'fetchUserUrls'. Either include it or remove the dependency array  react-hooks/exhaustive-deps


Error: Process completed with exit code 1.
