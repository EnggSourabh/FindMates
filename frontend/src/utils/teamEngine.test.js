import { describe, it, expect } from 'vitest';
import {
  generateSmartTeams,
  getSkillGapRecommendations,
  getTeamCompatibilitySignals,
} from './teamEngine';

const mockMembers = [
  { id: '1', name: 'Alice', skills: 'React, Figma', role: 'Frontend Developer', availability: 'Full-time' },
  { id: '2', name: 'Bob', skills: 'Python, FastAPI', role: 'Backend Developer', availability: 'Full-time' },
  { id: '3', name: 'Charlie', skills: 'Machine Learning, Analytics', role: 'ML Engineer', availability: 'Full-time' },
  { id: '4', name: 'Diana', skills: 'Pitching, Leadership', role: 'Project Lead', availability: 'Full-time' },
];

describe('teamEngine', () => {
  describe('generateSmartTeams', () => {
    it('generates teams with a specified size', () => {
      const teams = generateSmartTeams(mockMembers, 2);
      expect(teams.length).toBe(2);
      expect(teams[0].members.length).toBe(2);
      expect(teams[1].members.length).toBe(2);
    });

    it('assigns a leader and chemistry score', () => {
      const teams = generateSmartTeams(mockMembers, 4);
      expect(teams.length).toBe(1);
      expect(teams[0].leader).toBeDefined();
      expect(teams[0].chemistry).toBeGreaterThan(0);
      expect(teams[0].balanceScore).toBeGreaterThan(0);
    });
  });

  describe('getSkillGapRecommendations', () => {
    it('returns missing capabilities', () => {
      const partialMembers = [mockMembers[0], mockMembers[1]];
      const gaps = getSkillGapRecommendations(partialMembers);
      
      expect(gaps.length).toBeGreaterThan(0);
      expect(gaps.some(g => g.key === 'presentation')).toBe(true);
      expect(gaps.some(g => g.key === 'frontend')).toBe(false);
    });
  });

  describe('getTeamCompatibilitySignals', () => {
    it('calculates capability coverage and role diversity', () => {
      const signals = getTeamCompatibilitySignals(mockMembers);
      expect(signals.length).toBeGreaterThan(0);
      
      const roleDiversity = signals.find(s => s.label === 'Role diversity');
      expect(roleDiversity).toBeDefined();
      expect(roleDiversity.value).toContain('4 roles');
    });
  });
});
