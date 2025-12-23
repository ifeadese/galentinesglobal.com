# Technical Debt Cleanup Plan

## Overview
This document tracks code cleanup tasks to improve code quality, maintainability, and scalability according to software engineering best practices. Tasks are organized by priority and impact to allow progressive execution with production testing between phases.

---

## Phase 1: Dead Code Removal (Low Risk)
**Priority: High | Risk: Low | Estimated Time: 30 min**

### 1.1 Remove Unused Components & Files
- [ ] **Delete `components/mobile-drawer.tsx`**
  - Status: Not imported anywhere (replaced by overlay menu)
  - Risk: None (confirmed unused)
  - Test: Build and verify no import errors

- [ ] **Delete `pages/api/hello.js`**
  - Status: Default Next.js API route, not used
  - Risk: None (no references found)
  - Test: Verify no API routes depend on it

### 1.2 Remove Unused Imports
- [ ] **Clean up `components/pages.tsx`**
  - Remove unused imports: `BallotRounded`, `CropOriginalRounded`
  - Currently only `HomeRounded`, `InfoRounded`, `HelpRounded` are used
  - Risk: None
  - Test: Verify icons still render correctly

### 1.3 Remove Unused Helper Functions
- [ ] **Remove unused `Props` type from `helpers.ts`**
  - `type Props = { debounceTime?: number; }` - never used
  - Risk: None
  - Test: Build and verify no TypeScript errors

- [ ] **Remove `createRootServicePaths` and `createSubServicePaths` from `helpers.ts`**
  - Status: **CONFIRMED UNUSED** (dynamic routes removed, no getStaticPaths found)
  - Files: `helpers.ts` (lines 33-50)
  - Risk: None (verified no usage in codebase)
  - Test: Build and verify no errors

- [ ] **Remove `getServiceById` from `helpers.ts` (if unused)**
  - Status: Not used anywhere (no matches found in codebase)
  - Files: `helpers.ts` (lines 20-31)
  - Action: Verify once more, then remove if confirmed unused
  - Risk: Low (if truly unused)
  - Test: Build and verify no errors

### 1.4 Clean Up tsconfig.json
- [ ] **Remove reference to non-existent file**
  - Remove `data/loctineer/services/natural-hair-locking.js` from include
  - Risk: None (file doesn't exist)
  - Test: Build should succeed

---

## Phase 2: Code Quality Improvements (Low-Medium Risk)
**Priority: Medium | Risk: Low-Medium | Estimated Time: 1-2 hours**

### 2.1 Remove Commented Code
- [ ] **Clean `globals.scss`**
  - Remove commented swiper imports (lines 2-4)
  - Risk: Low (clearly unused)
  - Test: Verify no styling breaks

- [ ] **Clean `support.module.scss`**
  - Remove commented line: `// margin: 0 auto;` (line 94)
  - Risk: None
  - Test: Visual check of support page

- [ ] **Clean `helpers.ts`**
  - Remove commented line: `// subServices.push(service); // Optional` (line 78)
  - Risk: None
  - Test: Verify getSubServices still works

### 2.2 Fix Key Props (Best Practice)
- [ ] **Update MenuBar component**
  - Replace `key={idx}` with `key={page.name}` or `key={page.url}`
  - Files: `components/menu-bar.tsx` (lines 50, 77)
  - Risk: Low (improves React reconciliation)
  - Test: Verify menu navigation works

- [ ] **Update other components using index as key**
  - `components/services.tsx` - Consider using `service.id` as key
  - `components/accordion.tsx` - Consider using `price.name` or generate unique ID
  - `components/service.tsx` - Consider using `price.name` or unique ID
  - `components/sub-services-carousel.tsx` - Consider using `subService.id`
  - Risk: Low-Medium (verify unique identifiers exist)
  - Test: Test all affected components for proper rendering

### 2.3 Remove Unused Variable
- [ ] **Fix `components/mobile-drawer.tsx` (if keeping temporarily) or remove**
  - Remove unused `_index` parameter (line 43)
  - Actually, just delete the file (Phase 1.1)
  - Risk: None

---

## Phase 3: Type Safety Improvements (Medium Risk)
**Priority: High | Risk: Medium | Estimated Time: 1 hour**

### 3.1 Fix Type Assertions (`as any`)
- [ ] **Fix heroImage path typing in business data files**
  - Files: `data/phils-vision/index.ts`, `data/loctineer/index.ts`
  - Current: `path: "/images/panelists.jpeg" as any`
  - Solution: Update `AppImage` interface to accept `string | StaticImageData`
    - Modify `types.ts` to allow both types
    - Update `AppImage` interface: `path: StaticImageData | string`
  - Risk: Medium (may require type guards in components)
  - Test: 
    - Verify hero images still render
    - Check TypeScript compilation
    - Test both string paths and require() imports

---

## Phase 4: Code Consistency & Refactoring (Medium Risk)
**Priority: Medium | Risk: Medium | Estimated Time: 2-3 hours**

### 4.1 Standardize getStaticProps Pattern
- [ ] **Create helper function for getStaticProps**
  - Current: Duplicate `getStaticProps` in all pages with same pattern
  - Solution: Create `getPageStaticProps()` helper in `helpers.ts`
  - Files affected: `pages/index.tsx`, `pages/about.tsx`, `pages/support.tsx`, `pages/404.tsx`
  - Risk: Medium (changes build-time behavior)
  - Test:
    - Verify all pages build correctly
    - Test production build
    - Verify business data loads correctly on all pages

### 4.2 Standardize Component Props Naming
- [ ] **Rename `stringifiedBusinessObj` to `business`**
  - Current: Inconsistent naming across pages
  - Files: All page components
  - Risk: Low (internal naming only)
  - Test: Verify pages still render correctly

### 4.3 Extract Duplicate Styles (SCSS)
- [ ] **Extract duplicate separator styles in `footer.module.scss`**
  - Current: `.conference .separator` and `.copyright .separator` are identical
  - Solution: Create shared `.separator` class
  - Risk: Low
  - Test: Visual check of footer on all screen sizes

---

## Phase 5: Architecture & Best Practices (Medium-High Risk)
**Priority: Low-Medium | Risk: Medium-High | Estimated Time: 2-4 hours**

### 5.1 Move Analytics to _app.tsx
- [ ] **Fix Analytics placement**
  - Current: Analytics in `_document.js` (incorrect)
  - Solution: Move to `_app.tsx` (Next.js/Vercel best practice)
  - Risk: Medium (affects analytics tracking)
  - Test:
    - Verify analytics still tracks correctly
    - Check Vercel analytics dashboard
    - Test page views

### 5.2 Migrate from legacyBehavior (Future Consideration)
- [ ] **Plan migration from `legacyBehavior`**
  - Current: Using `legacyBehavior` prop with Next.js Link (deprecated)
  - Files: `components/menu-bar.tsx`, `pages/404.tsx`
  - Solution: Remove `legacyBehavior` and adjust child structure
  - Risk: Medium (may require style adjustments)
  - Status: **Deferred** - Next.js still supports, no urgency
  - Test: Verify links work correctly after migration

### 5.3 Consider Next.js Image Migration (Future)
- [ ] **Plan migration from `next/legacy/image`**
  - Current: Using `next/legacy/image` throughout codebase
  - Solution: Migrate to `next/image` when ready
  - Risk: High (many files, requires testing)
  - Status: **Deferred** - Legacy image works fine, migration is non-urgent
  - Test: Comprehensive testing of all images after migration

---

## Phase 6: Documentation & Comments (Low Risk)
**Priority: Low | Risk: None | Estimated Time: 30 min**

### 6.1 Add Code Comments
- [ ] **Add JSDoc comments to helper functions**
  - Files: `helpers.ts`
  - Document parameters and return types
  - Risk: None
  - Test: Verify TypeScript still compiles

### 6.2 Clean Up ESLint Disables
- [ ] **Review and document eslint-disable comments**
  - `components/pages.tsx`: `/* eslint-disable jsx-a11y/alt-text */`
    - Verify if still needed or fix the actual issue
  - `components/chat-button.tsx`: `eslint-disable-next-line @next/next/inline-script-id`
    - Document why this is needed (Facebook SDK requires inline script)
  - Risk: None
  - Test: Run linter to verify

---

## Execution Guidelines

### Testing Strategy
1. **After each phase**: Run full build and type check
2. **Manual testing**: Test affected features in development
3. **Production deployment**: Deploy to staging/production for each phase
4. **Monitor**: Check for errors, performance issues, or broken functionality

### Rollback Plan
- Each phase should be in a separate commit for easy rollback
- Test in production environment before proceeding to next phase
- Keep backups/previous versions accessible

### Success Criteria
- ✅ No TypeScript errors
- ✅ No build errors
- ✅ No runtime errors in console
- ✅ All features work as expected
- ✅ No performance degradation
- ✅ Cleaner, more maintainable codebase

---

## Notes

### Deferred Items (Non-Critical)
- Legacy behavior migration (Phase 5.2) - Low priority, Next.js still supports
- Next.js Image migration (Phase 5.3) - Non-urgent, legacy version works fine
- These can be addressed in future refactoring cycles

### Questions to Resolve
1. ~~Are `createRootServicePaths` and `createSubServicePaths` used anywhere?~~ **RESOLVED: No, confirmed unused - can be removed**
2. Confirm Analytics placement preference (currently in `_document.js`, should be in `_app.tsx` per Next.js docs)
3. Preferred approach for fixing `as any` type assertions? (Update AppImage interface or create type union?)

---

## Progress Tracking

**Last Updated**: [Date]
**Current Phase**: Not Started
**Next Action**: Phase 1.1 - Remove mobile-drawer.tsx

### Completed Items
- None yet

### In Progress
- None

### Blocked
- None

