# Design System Component Priority Matrix

## 🎯 Priority Matrix

### Critical (P0) - สร้างทันที
Components ที่จำเป็นมากและใช้บ่อยที่สุด

| Component | Priority | Use Cases | Estimated Effort |
|-----------|----------|-----------|------------------|
| Empty State | P0 | ทุกตาราง, รายการ | 2-3 hours |
| Error State | P0 | ทุก API call, Form validation | 2-3 hours |
| Avatar | P0 | Profile, User list, Comments | 3-4 hours |
| Status Badge | P0 | Leave, Training, Appraisal status | 2-3 hours |
| Search/Filter Bar | P0 | Employee search, Document search | 4-5 hours |

**Total P0 Effort**: ~13-18 hours (2-3 days)

### High (P1) - สร้างในสัปดาห์นี้
Components ที่สำคัญและใช้บ่อย

| Component | Priority | Use Cases | Estimated Effort |
|-----------|----------|-----------|------------------|
| Breadcrumbs | P1 | Deep navigation | 2-3 hours |
| Stepper/Wizard | P1 | Multi-step forms | 6-8 hours |
| Timeline | P1 | History, Workflow | 4-5 hours |
| Date Range Picker | P1 | Leave, Reports, Attendance | 4-5 hours |
| Skeleton Loader | P1 | Better loading UX | 3-4 hours |

**Total P1 Effort**: ~19-25 hours (3-4 days)

### Medium (P2) - สร้างในเดือนนี้
Components ที่มีประโยชน์แต่ไม่เร่งด่วน

| Component | Priority | Use Cases | Estimated Effort |
|-----------|----------|-----------|------------------|
| Image Upload/Preview | P2 | Profile picture, Documents | 5-6 hours |
| Form Validation Messages | P2 | Better form UX | 3-4 hours |
| Rating | P2 | Training, Appraisal rating | 3-4 hours |
| Slider/Range Slider | P2 | Filters, Range selection | 4-5 hours |
| Tree View | P2 | Org structure, Hierarchy | 6-8 hours |

**Total P2 Effort**: ~21-27 hours (3-4 days)

### Low (P3) - สร้างเมื่อมีเวลา
Components ที่ดีมีแต่ไม่จำเป็น

| Component | Priority | Use Cases | Estimated Effort |
|-----------|----------|-----------|------------------|
| Popover | P3 | Quick info, Help | 3-4 hours |
| Input Group | P3 | Currency, Percentage | 2-3 hours |
| Drag and Drop | P3 | Reorder items | 6-8 hours |
| Rich Text Editor | P3 | Email, Documents | 8-10 hours |
| Calendar | P3 | Leave calendar, Events | 6-8 hours |

**Total P3 Effort**: ~25-33 hours (4-5 days)

## 📊 Module-Specific Component Needs

### EMPVIEW Module
- ✅ Avatar (P0)
- ✅ Status Badge (P0)
- ✅ Empty State (P0)
- ✅ Timeline (P1)
- ✅ Date Range Picker (P1)

### PERSONAL Module
- ✅ Avatar (P0)
- ✅ Image Upload/Preview (P2)
- ✅ Form Validation Messages (P2)
- ✅ Stepper/Wizard (P1)

### TA (Time Attendance) Module
- ✅ Date Range Picker (P1)
- ✅ Calendar (P3)
- ✅ Search/Filter Bar (P0)
- ✅ Timeline (P1)

### PAYROLL Module
- ✅ Date Range Picker (P1)
- ✅ Status Badge (P0)
- ✅ Empty State (P0)
- ✅ Error State (P0)

### TRAINING Module
- ✅ Status Badge (P0)
- ✅ Stepper/Wizard (P1)
- ✅ Rating (P2)
- ✅ Timeline (P1)
- ✅ Image Upload/Preview (P2)

### APPRAISAL Module
- ✅ Status Badge (P0)
- ✅ Stepper/Wizard (P1)
- ✅ Rating (P2)
- ✅ Timeline (P1)
- ✅ Progress indicators

### RECRUIT Module
- ✅ Avatar (P0)
- ✅ Status Badge (P0)
- ✅ Search/Filter Bar (P0)
- ✅ Stepper/Wizard (P1)
- ✅ Timeline (P1)

### WELFARE Module
- ✅ Status Badge (P0)
- ✅ Stepper/Wizard (P1)
- ✅ Timeline (P1)
- ✅ Date Range Picker (P1)

## 🎨 Design System Foundation

### Current Foundation ✅
- Glassmorphism design system
- Dark mode support
- Theme color system
- Typography (Inter, Sarabun, JetBrains Mono)
- Spacing utilities
- Animation system

### Missing Foundation ⚠️
- Design tokens documentation
- Component usage guidelines
- Accessibility guidelines
- Component testing strategy
- Storybook integration

## 🚀 Quick Wins (สร้างก่อน)

### Week 1
1. **Empty State** - ใช้ได้ทุกที่
2. **Error State** - ใช้ได้ทุกที่
3. **Avatar** - ใช้ในหลาย modules
4. **Status Badge** - ใช้ในหลาย modules

### Week 2
5. **Search/Filter Bar** - ใช้ในหลาย modules
6. **Breadcrumbs** - Navigation improvement
7. **Skeleton Loader** - Better UX
8. **Date Range Picker** - ใช้ในหลาย modules

### Week 3-4
9. **Stepper/Wizard** - Multi-step forms
10. **Timeline** - History display
11. **Image Upload/Preview** - Profile pictures
12. **Form Validation Messages** - Better forms

## 📈 Impact Analysis

### High Impact Components
- **Empty State** - Improves UX when no data
- **Error State** - Better error handling
- **Avatar** - Visual consistency
- **Status Badge** - Clear status indication
- **Search/Filter Bar** - Essential for data-heavy modules

### Medium Impact Components
- **Stepper/Wizard** - Better form UX
- **Timeline** - Better history display
- **Date Range Picker** - Common use case
- **Skeleton Loader** - Better loading UX

### Low Impact Components
- **Drag and Drop** - Nice to have
- **Rich Text Editor** - Limited use cases
- **Calendar** - Can use date picker instead

## 💡 Recommendations

### Immediate Actions
1. ✅ Create P0 components (Empty State, Error State, Avatar, Status Badge, Search/Filter)
2. ✅ Add to UI Kit page
3. ✅ Document usage
4. ✅ Add examples

### Short-term Actions
1. ✅ Create P1 components
2. ✅ Integrate with existing modules
3. ✅ Add Storybook
4. ✅ Create design tokens documentation

### Long-term Actions
1. ✅ Create P2/P3 components as needed
2. ✅ Complete documentation
3. ✅ Accessibility audit
4. ✅ Performance optimization

## 📝 Component Checklist

### Before Creating a Component
- [ ] Check if Material Design has it
- [ ] Check if we can extend existing component
- [ ] Define use cases clearly
- [ ] Design API (Inputs/Outputs)
- [ ] Plan dark mode support
- [ ] Plan theme color support
- [ ] Plan responsive design
- [ ] Plan accessibility

### After Creating a Component
- [ ] Add to SharedModule
- [ ] Add to UI Kit page
- [ ] Write documentation
- [ ] Add examples
- [ ] Test dark mode
- [ ] Test theme colors
- [ ] Test responsive
- [ ] Test accessibility
- [ ] Add to Storybook (if available)

## 🎯 Success Criteria

### Component Quality
- ✅ Reusable across modules
- ✅ Consistent styling
- ✅ Dark mode support
- ✅ Theme color support
- ✅ Responsive design
- ✅ Accessible (WCAG 2.1)
- ✅ Well documented
- ✅ Tested

### Developer Experience
- ✅ Easy to use
- ✅ Clear API
- ✅ Good examples
- ✅ Type-safe
- ✅ Well documented

### User Experience
- ✅ Consistent across modules
- ✅ Intuitive
- ✅ Accessible
- ✅ Performant
- ✅ Beautiful


