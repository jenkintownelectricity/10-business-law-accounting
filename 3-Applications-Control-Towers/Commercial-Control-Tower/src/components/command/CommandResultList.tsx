import React, { useEffect, useRef } from 'react';

export interface CommandResult {
  id: string;
  label: string;
  description: string;
  category: string;
  shortcut?: string;
}

export interface CommandResultListProps {
  results: CommandResult[];
  selectedIndex: number;
  onSelect: (id: string) => void;
  onHover: (index: number) => void;
  className?: string;
}

/**
 * CommandResultList
 *
 * List of matched commands with keyboard selection.
 * Supports arrow key navigation and mouse hover selection.
 */
export const CommandResultList: React.FC<CommandResultListProps> = ({
  results,
  selectedIndex,
  onSelect,
  onHover,
  className,
}) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const selected = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (results.length === 0) {
    return (
      <div className={`cct-command-results cct-command-results--empty ${className || ''}`}>
        <p className="cct-command-results__empty-message">No commands match your query</p>
      </div>
    );
  }

  return (
    <ul
      ref={listRef}
      className={`cct-command-results ${className || ''}`}
      data-component="command-result-list"
      role="listbox"
    >
      {results.map((result, index) => (
        <li
          key={result.id}
          className={`cct-command-results__item ${index === selectedIndex ? 'cct-command-results__item--selected' : ''}`}
          data-command-id={result.id}
          role="option"
          aria-selected={index === selectedIndex}
          onClick={() => onSelect(result.id)}
          onMouseEnter={() => onHover(index)}
        >
          <span className="cct-command-results__category">{result.category}</span>
          <span className="cct-command-results__label">{result.label}</span>
          <span className="cct-command-results__description">{result.description}</span>
          {result.shortcut && (
            <kbd className="cct-command-results__shortcut">{result.shortcut}</kbd>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CommandResultList;
