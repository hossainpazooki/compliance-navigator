// Core evaluation functions
export {
  getIn,
  evaluateCondition,
  evaluateTree,
  evaluatePartial,
  collectFactPaths,
  countNodes,
} from './evaluator';

// Conflict detection
export {
  detectConflicts,
  mergeObligations,
} from './conflicts';
