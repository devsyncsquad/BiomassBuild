import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors, borderRadius, shadows } from '../theme';

const StyledButton = styled(MuiButton)(({ theme, variant, size, fullWidth }) => ({
  borderRadius: borderRadius.md,
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  minHeight: size === 'small' ? '32px' : size === 'large' ? '48px' : '40px',
  padding: size === 'small' 
    ? '6px 16px' 
    : size === 'large' 
    ? '12px 24px' 
    : '8px 20px',
  fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
  width: fullWidth ? '100%' : 'auto',
  
  // Primary variant
  '&.MuiButton-contained': {
    backgroundColor: colors.primary.main,
    color: colors.text.inverse,
    '&:hover': {
      backgroundColor: colors.primary.dark,
      boxShadow: shadows.lg,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      backgroundColor: colors.gray[300],
      color: colors.gray[600],
    },
  },
  
  // Secondary variant
  '&.MuiButton-outlined': {
    borderColor: colors.primary.main,
    color: colors.primary.main,
    borderWidth: '1.5px',
    '&:hover': {
      backgroundColor: colors.primary[50],
      borderColor: colors.primary.dark,
      boxShadow: shadows.md,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      borderColor: colors.gray[300],
      color: colors.gray[600],
    },
  },
  
  // Text variant
  '&.MuiButton-text': {
    color: colors.primary.main,
    '&:hover': {
      backgroundColor: colors.primary[50],
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      color: colors.gray[600],
    },
  },
  
  // Success variant
  '&.MuiButton-contained.MuiButton-colorSuccess': {
    backgroundColor: colors.success.main,
    '&:hover': {
      backgroundColor: colors.success.dark,
    },
  },
  
  // Warning variant
  '&.MuiButton-contained.MuiButton-colorWarning': {
    backgroundColor: colors.warning.main,
    '&:hover': {
      backgroundColor: colors.warning.dark,
    },
  },
  
  // Error variant
  '&.MuiButton-contained.MuiButton-colorError': {
    backgroundColor: colors.error.main,
    '&:hover': {
      backgroundColor: colors.error.dark,
    },
  },
  
  // Info variant
  '&.MuiButton-contained.MuiButton-colorInfo': {
    backgroundColor: colors.info.main,
    '&:hover': {
      backgroundColor: colors.info.dark,
    },
  },
}));

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium', 
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
