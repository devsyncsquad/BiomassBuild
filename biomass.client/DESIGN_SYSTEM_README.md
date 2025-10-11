# BiomassPro Design System

A comprehensive Vuexy-inspired design system for the BiomassPro application, featuring modern UI components, consistent theming, and professional styling.

## 🎨 Design System Overview

### Color Palette
Based on Vuexy's professional color scheme:

- **Primary**: `#7367F0` (Vuexy Purple)
- **Success**: `#28C76F` (Vuexy Green)
- **Warning**: `#FF9F43` (Vuexy Orange)
- **Error**: `#EA5455` (Vuexy Red)
- **Info**: `#00CFE8` (Vuexy Cyan)
- **Neutral Grays**: 50-900 scale for backgrounds and text

### Typography
- **Font Family**: Inter (primary), Roboto (fallback)
- **Font Weights**: 300 (light) to 800 (extrabold)
- **Responsive Scale**: xs (12px) to 5xl (48px)

### Spacing & Layout
- **Consistent Spacing**: 4px base unit (0.25rem to 8rem)
- **Border Radius**: 4px (sm) to 24px (2xl)
- **Shadows**: Subtle elevation system (sm to 2xl)

## 🧩 Components

### Core Components

#### Button
```jsx
import { Button } from './theme/components';

<Button 
  variant="contained" 
  color="primary" 
  size="medium"
  startIcon={<AddIcon />}
>
  Add New
</Button>
```

**Variants**: `contained`, `outlined`, `text`
**Colors**: `primary`, `success`, `warning`, `error`, `info`
**Sizes**: `small`, `medium`, `large`

#### Card
```jsx
import { Card } from './theme/components';

<Card 
  header="Card Title" 
  subheader="Card subtitle"
  variant="elevated"
  actions={<Button>Action</Button>}
>
  Card content
</Card>
```

**Variants**: `default`, `elevated`, `outlined`, `interactive`

#### StatCard
```jsx
import { StatCard } from './theme/components';

<StatCard
  title="Today's Dispatches"
  value={18}
  change="+12%"
  changeType="positive"
  variant="primary"
  icon={<ShippingIcon />}
/>
```

**Variants**: `default`, `primary`, `success`, `warning`, `error`, `info`
**Change Types**: `positive`, `negative`, `neutral`

#### DataTable
```jsx
import { DataTable } from './theme/components';

<DataTable
  title="Dispatches"
  data={dispatchData}
  columns={columns}
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
  filters={[
    { field: 'status', label: 'Status', type: 'select', options: [...] },
    { field: 'vehicle', label: 'Vehicle', type: 'select', options: [...] }
  ]}
/>
```

**Features**:
- Pagination
- Sorting
- Filtering
- Export functionality
- Row actions (View, Edit, Delete, Print)
- Responsive design

### Layout Components

#### AppLayout
```jsx
import { AppLayout } from './theme/components';

<AppLayout 
  user={user} 
  onLogout={handleLogout}
  currentPath="/dashboard"
>
  {children}
</AppLayout>
```

**Features**:
- Collapsible sidebar (dark theme)
- Topbar with search and notifications
- Breadcrumb navigation
- Responsive design
- User avatar and menu

## 🎯 Usage Guidelines

### Importing Components
```jsx
// Import individual components
import { Button, Card, StatCard, DataTable } from './theme/components';

// Import theme utilities
import { colors, typography, spacing } from './theme/components';
```

### Styling Guidelines

#### Using Theme Colors
```jsx
import { colors } from './theme/components';

<Box sx={{ 
  backgroundColor: colors.primary.main,
  color: colors.text.inverse 
}}>
  Content
</Box>
```

#### Using Typography Scale
```jsx
import { typography } from './theme/components';

<Typography sx={{ 
  fontSize: typography.fontSize.xl,
  fontWeight: typography.fontWeight.semibold 
}}>
  Heading
</Typography>
```

#### Using Spacing
```jsx
import { spacing } from './theme/components';

<Box sx={{ 
  padding: spacing[4],
  marginBottom: spacing[6] 
}}>
  Content
</Box>
```

## 📱 Responsive Design

The design system is built with mobile-first responsive design:

- **Breakpoints**: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)
- **Mobile Sidebar**: Collapses to temporary drawer
- **Table Responsiveness**: Horizontal scrolling on mobile
- **Grid System**: Responsive grid with auto-sizing

## ♿ Accessibility

- **Color Contrast**: Minimum 4.5:1 ratio
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear focus states
- **Semantic HTML**: Proper HTML structure

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install recharts react-icons styled-components @types/styled-components
```

### 2. Import Theme
```jsx
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 3. Use Components
```jsx
import { Button, Card, StatCard, DataTable } from './theme/components';

function MyComponent() {
  return (
    <Card header="My Card">
      <StatCard 
        title="KPI" 
        value={100} 
        variant="primary" 
      />
      <Button variant="contained">
        Action
      </Button>
    </Card>
  );
}
```

## 📊 Dashboard Features

The enhanced dashboard includes:

### KPI Stat Cards
- Today's Dispatches
- Net Weight
- Loader Cost
- Pending Collections

### Charts (Recharts)
- Weekly performance trend (Line chart)
- Material distribution (Pie chart)
- Responsive and interactive

### Recent Activity
- Real-time activity feed
- Categorized by type
- Time stamps and icons

## 🔧 Customization

### Extending the Theme
```jsx
import { createTheme } from '@mui/material/styles';
import { theme as baseTheme } from './theme/components';

const customTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: '#your-custom-color',
    },
  },
});
```

### Adding New Components
1. Create component in `src/theme/components/`
2. Export from `src/theme/components/index.js`
3. Follow existing patterns for consistency

## 📝 Best Practices

1. **Consistent Spacing**: Use the spacing scale (0-32)
2. **Color Usage**: Use theme colors, avoid hardcoded values
3. **Typography**: Use the typography scale for consistent text sizing
4. **Component Composition**: Compose complex UIs from simple components
5. **Responsive Design**: Always consider mobile experience
6. **Accessibility**: Include proper ARIA labels and keyboard support

## 🐛 Troubleshooting

### Common Issues

1. **Font not loading**: Ensure Inter font is loaded in index.html
2. **Theme not applying**: Check ThemeProvider wrapper
3. **Component not importing**: Verify export in index.js
4. **Responsive issues**: Check breakpoint usage

### Debug Mode
Enable debug mode to see theme values:
```jsx
console.log(themeUtils); // Access all theme utilities
```

## 📚 Resources

- [Vuexy Design System](https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/)
- [Material-UI Documentation](https://mui.com/)
- [Recharts Documentation](https://recharts.org/)
- [Inter Font](https://rsms.me/inter/)

## 🤝 Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns
2. Include proper TypeScript types
3. Add comprehensive documentation
4. Test on multiple screen sizes
5. Ensure accessibility compliance
6. Update this README if needed

---

**Note**: This design system maintains backward compatibility with existing components while providing a modern, professional interface that matches Vuexy's aesthetic standards.
