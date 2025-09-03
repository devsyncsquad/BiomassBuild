import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors, borderRadius, shadows } from '../theme';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const StyledStatCard = styled(Box)(({ theme, variant, color }) => ({
  padding: '24px',
  borderRadius: borderRadius.lg,
  boxShadow: shadows.base,
  border: `1px solid ${colors.gray[200]}`,
  backgroundColor: colors.background.paper,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  
  '&:hover': {
    boxShadow: shadows.lg,
    transform: 'translateY(-2px)',
  },
  
  // Color variants
  '&.primary': {
    background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
    color: colors.text.inverse,
    '& .stat-value': {
      color: colors.text.inverse,
    },
    '& .stat-label': {
      color: colors.primary[100],
    },
    '& .stat-change': {
      color: colors.primary[100],
    },
  },
  
  '&.success': {
    background: `linear-gradient(135deg, ${colors.success.main} 0%, ${colors.success.light} 100%)`,
    color: colors.text.inverse,
    '& .stat-value': {
      color: colors.text.inverse,
    },
    '& .stat-label': {
      color: colors.success[100],
    },
    '& .stat-change': {
      color: colors.success[100],
    },
  },
  
  '&.warning': {
    background: `linear-gradient(135deg, ${colors.warning.main} 0%, ${colors.warning.light} 100%)`,
    color: colors.text.inverse,
    '& .stat-value': {
      color: colors.text.inverse,
    },
    '& .stat-label': {
      color: colors.warning[100],
    },
    '& .stat-change': {
      color: colors.warning[100],
    },
  },
  
  '&.error': {
    background: `linear-gradient(135deg, ${colors.error.main} 0%, ${colors.error.light} 100%)`,
    color: colors.text.inverse,
    '& .stat-value': {
      color: colors.text.inverse,
    },
    '& .stat-label': {
      color: colors.error[100],
    },
    '& .stat-change': {
      color: colors.error[100],
    },
  },
  
  '&.info': {
    background: `linear-gradient(135deg, ${colors.info.main} 0%, ${colors.info.light} 100%)`,
    color: colors.text.inverse,
    '& .stat-value': {
      color: colors.text.inverse,
    },
    '& .stat-label': {
      color: colors.info[100],
    },
    '& .stat-change': {
      color: colors.info[100],
    },
  },
  
  // Default variant
  '&.default': {
    backgroundColor: colors.background.paper,
    '& .stat-value': {
      color: colors.text.primary,
    },
    '& .stat-label': {
      color: colors.text.secondary,
    },
    '& .stat-change': {
      color: colors.text.secondary,
    },
  },
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: '8px',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '16px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const StatChange = styled(Box)(({ theme, trend }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.875rem',
  fontWeight: 500,
  
  '& .trend-icon': {
    fontSize: '1rem',
  },
  
  '&.positive': {
    color: colors.success.main,
  },
  
  '&.negative': {
    color: colors.error.main,
  },
  
  '&.neutral': {
    color: colors.text.secondary,
  },
}));

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  variant = 'default', // 'default', 'primary', 'success', 'warning', 'error', 'info'
  icon,
  subtitle,
  ...props 
}) => {
  const getTrendIcon = () => {
    if (changeType === 'positive') return <TrendingUpIcon className="trend-icon" />;
    if (changeType === 'negative') return <TrendingDownIcon className="trend-icon" />;
    return <TrendingFlatIcon className="trend-icon" />;
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <StyledStatCard variant={variant} className={variant} {...props}>
      {icon && (
        <Box sx={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.1 }}>
          {icon}
        </Box>
      )}
      
      <StatLabel className="stat-label">
        {title}
      </StatLabel>
      
      <StatValue className="stat-value">
        {formatValue(value)}
      </StatValue>
      
      {subtitle && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: variant === 'default' ? colors.text.secondary : 'inherit',
            opacity: 0.8,
            marginBottom: '12px'
          }}
        >
          {subtitle}
        </Typography>
      )}
      
      {change !== undefined && (
        <StatChange trend={changeType} className={changeType}>
          {getTrendIcon()}
          <span>{change}</span>
        </StatChange>
      )}
    </StyledStatCard>
  );
};

export default StatCard;
