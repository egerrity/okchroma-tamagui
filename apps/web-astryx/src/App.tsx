import {useMemo, useState} from 'react';
import {Theme, defineTheme} from '@astryxdesign/core/theme';
import {Button} from '@astryxdesign/core/Button';
import {brandNames, byBrand, defaultBrand} from '@poc/theme/dist/brands';
import {buildOkchromaTheme, type BrandName} from './themes/okchromaTheme';
import {buildAstryxSeedTheme} from './themes/astryxSeedTheme';
import TableFilterTemplate from './pages/TableFilter';

const VARIANTS = ['primary', 'secondary', 'ghost', 'destructive'] as const;
type Mode = 'light' | 'dark';
type Candidate = 'okchroma' | 'astryx';
type View = 'button' | 'table';

// Core defaults only, so the page chrome adds nothing the panels could inherit.
const pageTheme = defineTheme({name: 'page'});

function params() {
  return new URLSearchParams(location.search);
}
/** `?brand=<name>`, one of brands.ts, else the first; a new hex is a brand and a build, never a literal here */
function brandFromUrl(): BrandName {
  const b = params().get('brand');
  return b && (brandNames as readonly string[]).includes(b) ? (b as BrandName) : defaultBrand;
}
function viewFromUrl(): View {
  return params().get('view') === 'table' ? 'table' : 'button';
}
function modeFromUrl(): Mode {
  return params().get('mode') === 'light' ? 'light' : 'dark';
}
function candidateFromUrl(): Candidate {
  return params().get('candidate') === 'astryx' ? 'astryx' : 'okchroma';
}

export default function App() {
  const [brand, setBrand] = useState<BrandName>(brandFromUrl);
  const [mode, setMode] = useState<Mode>(modeFromUrl);
  const [view, setView] = useState<View>(viewFromUrl);
  const [candidate, setCandidate] = useState<Candidate>(candidateFromUrl);
  const okchroma = useMemo(() => buildOkchromaTheme(brand), [brand]);
  const astryx = useMemo(() => buildAstryxSeedTheme(brand), [brand]);

  const controls = (
    <>
      <label>
        brand{' '}
        <select value={brand} onChange={(e) => setBrand(e.target.value as BrandName)}>
          {brandNames.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>{' '}
        <code>{byBrand[brand].SEED}</code>
      </label>
      <label>
        <input
          type="checkbox"
          checked={mode === 'light'}
          onChange={(e) => setMode(e.target.checked ? 'light' : 'dark')}
        />{' '}
        light reference
      </label>
      <label>
        view{' '}
        <select value={view} onChange={(e) => setView(e.target.value as View)}>
          <option value="button">01 button</option>
          <option value="table">02 table</option>
        </select>
      </label>
    </>
  );

  if (view === 'table') {
    return (
      <Theme theme={pageTheme} mode={mode}>
        <div className="table-view" data-mode={mode}>
          <div className="pill">
            {controls}
            <label>
              candidate{' '}
              <select value={candidate} onChange={(e) => setCandidate(e.target.value as Candidate)}>
                <option value="okchroma">okchroma</option>
                <option value="astryx">astryx from seed</option>
              </select>
            </label>
          </div>
          <Theme theme={candidate === 'okchroma' ? okchroma : astryx} mode={mode}>
            <TableFilterTemplate />
          </Theme>
        </div>
      </Theme>
    );
  }

  return (
    <Theme theme={pageTheme} mode={mode}>
      <main className="exhibit" data-mode={mode}>
        <header className="controls">{controls}</header>
        <section className="panels">
          <Panel label="okchroma" theme={okchroma} mode={mode} />
          <Panel label="astryx from seed" theme={astryx} mode={mode} />
        </section>
      </main>
    </Theme>
  );
}

function Panel({label, theme, mode}: {label: string; theme: ReturnType<typeof defineTheme>; mode: Mode}) {
  return (
    <div className="panel">
      <h2 className="label">{label}</h2>
      <Theme theme={theme} mode={mode}>
        <div className="ground">
          {VARIANTS.map((variant) => (
            <div className="row" key={variant}>
              <Button label={variant} variant={variant} />
              <Button label={variant} variant={variant} isDisabled />
            </div>
          ))}
        </div>
      </Theme>
    </div>
  );
}
