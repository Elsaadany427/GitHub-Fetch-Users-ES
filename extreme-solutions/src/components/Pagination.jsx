import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiPagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Pagination({ page, pageSize, totalItems, onChange }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ my: 2 }}>
      <MuiPagination
        color="primary"
        size={isXs ? 'small' : 'medium'}
        page={page}
        count={totalPages}
        onChange={(_e, value) => onChange(value)}
        showFirstButton={!isXs}
        showLastButton={!isXs}
        siblingCount={isXs ? 0 : 1}
        boundaryCount={isXs ? 1 : 2}
      />
      <Typography variant="caption" sx={{ mt: 0.5 }}>Page {page} of {totalPages}</Typography>
    </Stack>
  );
}
