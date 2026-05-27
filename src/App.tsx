import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Play, RotateCcw, XCircle } from 'lucide-react';
import { parseExpression } from './parser';
import type { ParseFailure, ParseSuccess } from './parser';
import './styles.css';

const initialExpression = '2 * (3 + 4) = 10';

const examples = [
  '1 + 2 = 3',
  '2 * 3 + 4 = 10',
  '2 * (3 + 4) = 10',
  '6 = 10 / 2 + 1',
  '12 + 3 != 4 / 2 + 5',
  '2 + 3 * 2 = 10',
  '2 * 3 + 4 != 10',
  '1 + (2 = 3',
];

const formatAst = (result: ParseSuccess | ParseFailure) => {
  if (!result.ok) {
    return 'No AST available for invalid input.';
  }

  return JSON.stringify(result.ast, null, 2);
};

const getResultLabel = (result: ParseSuccess | ParseFailure) => {
  if (!result.ok) {
    return 'Invalid';
  }

  if (!result.isStatement) {
    return String(result.result);
  }

  return result.result ? 'true' : 'false';
};

const getErrorPointer = (input: string, result: ParseFailure) => {
  const offset = result.error.offset;

  if (offset === undefined) {
    return null;
  }

  const lineStart = input.lastIndexOf('\n', offset - 1) + 1;
  const lineEnd = input.indexOf('\n', offset);
  const line = input.slice(lineStart, lineEnd === -1 ? input.length : lineEnd);
  const column = Math.max(offset - lineStart, 0);

  return {
    line,
    marker: `${' '.repeat(column)}^`,
  };
};

function App() {
  const [expression, setExpression] = useState(initialExpression);
  const parsed = useMemo(() => parseExpression(expression), [expression]);
  const pointer = !parsed.ok ? getErrorPointer(expression, parsed) : null;

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <header className="topbar">
          <div>
            <p className="eyebrow">Nearley + Moo</p>
            <h1 id="app-title">Math Equation Parser</h1>
          </div>
          <div className={`status-pill ${parsed.ok ? 'status-pill--valid' : 'status-pill--invalid'}`}>
            {parsed.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{parsed.ok ? 'Valid expression' : 'Invalid query'}</span>
          </div>
        </header>

        <div className="content-grid">
          <section className="panel input-panel" aria-labelledby="input-title">
            <div className="panel-heading">
              <h2 id="input-title">Expression</h2>
              <button className="icon-button" type="button" onClick={() => setExpression(initialExpression)}>
                <RotateCcw size={17} />
                <span>Reset</span>
              </button>
            </div>

            <textarea
              aria-label="Math expression"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              spellCheck={false}
            />

            <div className="example-grid" aria-label="Example expressions">
              {examples.map((example) => (
                <button
                  className="example-button"
                  key={example}
                  type="button"
                  onClick={() => setExpression(example)}
                >
                  <Play size={14} />
                  <span>{example}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel result-panel" aria-labelledby="result-title">
            <div className="panel-heading">
              <h2 id="result-title">Evaluation</h2>
              {parsed.ok && !parsed.isStatement ? <span className="muted-label">Arithmetic value</span> : null}
            </div>

            <div className={`result-display ${parsed.ok ? 'result-display--valid' : 'result-display--invalid'}`}>
              {parsed.ok ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
              <strong>{getResultLabel(parsed)}</strong>
            </div>

            {!parsed.ok ? (
              <div className="error-box">
                <p>{parsed.error.message.split('\n')[0]}</p>
                <dl>
                  {parsed.error.line !== undefined ? (
                    <>
                      <dt>Line</dt>
                      <dd>{parsed.error.line}</dd>
                    </>
                  ) : null}
                  {parsed.error.column !== undefined ? (
                    <>
                      <dt>Column</dt>
                      <dd>{parsed.error.column}</dd>
                    </>
                  ) : null}
                  {parsed.error.token ? (
                    <>
                      <dt>Token</dt>
                      <dd>{parsed.error.token}</dd>
                    </>
                  ) : null}
                </dl>
                {pointer ? (
                  <pre className="error-pointer">
                    {pointer.line}
                    {'\n'}
                    {pointer.marker}
                  </pre>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="panel ast-panel" aria-labelledby="ast-title">
            <div className="panel-heading">
              <h2 id="ast-title">AST</h2>
              <span className="muted-label">{parsed.ok ? parsed.ast.type : 'Unavailable'}</span>
            </div>
            <pre className="ast-output">{formatAst(parsed)}</pre>
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;
