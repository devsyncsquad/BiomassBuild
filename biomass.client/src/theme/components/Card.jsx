import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors, borderRadius, shadows } from '../theme';

const StyledCard = styled(MuiCard)(({ theme, variant, elevation }) => ({
  borderRadius: borderRadius.lg,
  boxShadow: elevation === 'none' ? 'none' : elevation === 'high' ? shadows.xl : shadows.base,
  border: `1px solid ${colors.gray[200]}`,
  transition: 'all 0.2s ease-in-out',
  backgroundColor: colors.background.paper,
  overflow: 'hidden',
  
  '&:hover': {
    boxShadow: elevation === 'none' ? shadows.base : elevation === 'high' ? shadows['2xl'] : shadows.lg,
    transform: 'translateY(-2px)',
  },
  
  // Interactive variant
  '&.interactive': {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)',
    },
  },
  
  // Elevated variant
  '&.elevated': {
    boxShadow: shadows.lg,
    '&:hover': {
      boxShadow: shadows.xl,
    },
  },
  
  // Outlined variant
  '&.outlined': {
    boxShadow: 'none',
    border: `2px solid ${colors.gray[300]}`,
    '&:hover': {
      borderColor: colors.primary.main,
      boxShadow: shadows.sm,
    },
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: '24px 24px 16px 24px',
  '& .MuiCardHeader-title': {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.text.primary,
  },
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: colors.text.secondary,
  },
  '& .MuiCardHeader-action': {
    margin: 0,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme, padding }) => ({
  padding: padding === 'none' ? 0 : padding === 'compact' ? '16px 24px' : '24px',
  '&:last-child': {
    paddingBottom: padding === 'none' ? 0 : padding === 'compact' ? '16px' : '24px',
  },
}));

const StyledCardActions = styled(CardActions)(({ theme, padding }) => ({
  padding: padding === 'none' ? 0 : padding === 'compact' ? '8px 24px 24px' : '16px 24px 24px',
  gap: '8px',
}));

const Card = ({ 
  children, 
  variant = 'default', 
  elevation = 'default',
  padding = 'default',
  header,
  subheader,
  action,
  actions,
  onClick,
  ...props 
}) => {
  const cardClasses = [];
  if (variant === 'interactive') cardClasses.push('interactive');
  if (variant === 'elevated') cardClasses.push('elevated');
  if (variant === 'outlined') cardClasses.push('outlined');
  
  return (
    <StyledCard 
      variant={variant}
      elevation={elevation}
      className={cardClasses.join(' ')}
      onClick={onClick}
      {...props}
    >
      {(header || subheader || action) && (
        <StyledCardHeader
          title={header}
          subheader={subheader}
          action={action}
        />
      )}
      
      <StyledCardContent padding={padding}>
        {children}
      </StyledCardContent>
      
      {actions && (
        <StyledCardActions padding={padding}>
          {actions}
        </StyledCardActions>
      )}
    </StyledCard>
  );
};

export default Card;
