import styles from './ArchitectureDiagram.module.css';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Architecture diagram
 * ─────────────────────────────────────────────────────────────────────────────
 * Drawn in HTML and CSS rather than as an SVG or a Mermaid render, for three
 * reasons: the labels stay real selectable text (so find-in-page and search
 * crawlers see them), it reflows properly at 320px instead of scaling to
 * illegibility, and it inherits the theme tokens so light mode is not a second
 * asset to maintain.
 *
 * Structurally it is a stack of layers flowing downward. That reads the same
 * on a phone and a desktop, which a left-to-right flow does not.
 *
 * The whole figure is `aria-hidden` and paired with a written summary, because
 * a diagram traversed node-by-node by a screen reader is noise — the prose
 * carries the same information in a form that can actually be listened to.
 */
export function ArchitectureDiagram({ architecture }) {
  if (!architecture) return null;
  const { caption, summary, layers, feedback } = architecture;

  return (
    <figure className={styles.figure}>
      <div className={styles.diagram} aria-hidden="true">
        {layers.map((layer, layerIndex) => (
          <div key={layerIndex} className={styles.layer}>
            {layerIndex > 0 && (
              <div className={styles.connector}>
                <span className={styles.connectorLine} />
                {layer.connector && (
                  <span className={styles.connectorLabel}>{layer.connector}</span>
                )}
                <span className={styles.connectorArrow} />
              </div>
            )}

            <div
              className={styles.nodes}
              data-count={layer.nodes.length}
            >
              {layer.nodes.map((node, nodeIndex) => (
                <div
                  key={nodeIndex}
                  className={styles.node}
                  data-kind={node.kind}
                  data-branch={node.branch}
                >
                  {node.branch && (
                    <span className={styles.branchTag}>{node.branch}</span>
                  )}
                  <span className={styles.nodeLabel}>{node.label}</span>
                  {node.sub && <span className={styles.nodeSub}>{node.sub}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {feedback && <p className={styles.feedback}>{feedback}</p>}
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.captionTitle}>{caption}</span>
        {summary && <span className={styles.captionSummary}>{summary}</span>}
      </figcaption>
    </figure>
  );
}
