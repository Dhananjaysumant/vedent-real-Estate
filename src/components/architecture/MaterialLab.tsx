import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from '../ui/Icons';
import { materials, type MaterialId } from '../../data/properties';

export function MaterialLab() {
  const [selected, setSelected] = useState<MaterialId>('limestone');
  const active = materials.find((material) => material.id === selected) ?? materials[0];

  return (
    <div className="material-lab">
      <div className="material-lab__list" role="group" aria-label="Material finishes">
        {materials.map((material) => (
          <button
            key={material.id}
            type="button"
            className={`material-lab__option${selected === material.id ? ' is-active' : ''}`}
            onClick={() => setSelected(material.id)}
            aria-pressed={selected === material.id}
          >
            <span
              className="material-lab__swatch"
              style={{
                background: `linear-gradient(135deg, ${material.swatch}, ${material.swatchSecondary})`,
              }}
              aria-hidden="true"
            />
            <span className="material-lab__option-copy">
              <strong>{material.name}</strong>
              <small>{material.origin}</small>
            </span>
            <span className="material-lab__plus" aria-hidden="true">
              +
            </span>
          </button>
        ))}
      </div>

      <div
        className="material-lab__preview"
        style={{
          background: `radial-gradient(120% 100% at 30% 0%, ${active.swatch}, ${active.swatchSecondary})`,
        }}
      >
        <div className="material-lab__grain" aria-hidden="true" />
        <div className="material-lab__preview-copy">
          <span className="material-lab__label">Selected finish</span>
          <h3>{active.name}</h3>
          <p>{active.description}</p>
          <dl>
            <div>
              <dt>Origin</dt>
              <dd>{active.origin}</dd>
            </div>
            <div>
              <dt>Applied to</dt>
              <dd>{active.appliesTo}</dd>
            </div>
          </dl>
          <Link to="/explorer" className="link-arrow">
            See it on the 3D villa
            <ArrowUpRight size={13} />
          </Link>
        </div>
        <span className="material-lab__index" aria-hidden="true">
          {String(materials.findIndex((material) => material.id === selected) + 1).padStart(2, '0')} / 06
        </span>
      </div>
    </div>
  );
}
