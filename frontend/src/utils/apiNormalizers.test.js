import { describe, it, expect } from 'vitest';
import { mergeMembers } from './apiNormalizers';

describe('mergeMembers', () => {
  it('deduplicates members based on fingerprint', () => {
    const current = [
      { id: '1', name: 'Alice', role: 'Frontend Developer', availability: 'Full-time', skills: 'React', interests: '' }
    ];
    
    const incoming = [
      { id: '2', name: 'Alice', role: 'Frontend Developer', availability: 'Full-time', skills: 'React', interests: '' },
      { id: '3', name: 'Bob', role: 'Backend Developer', availability: 'Full-time', skills: 'Python', interests: '' }
    ];

    const result = mergeMembers(current, incoming);
    
    expect(result.length).toBe(2);
    expect(result.find(m => m.name === 'Alice').id).toBe('1');
    expect(result.find(m => m.name === 'Bob')).toBeDefined();
  });
});
