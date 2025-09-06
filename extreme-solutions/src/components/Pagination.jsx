import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MuiPagination from '@mui/material/Pagination';

export default function Pagination({ page, pageSize, totalItems, onChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ my: 2 }}>
      <MuiPagination
        color="primary"
        page={page}
        count={totalPages}
        onChange={(_e, value) => onChange(value)}
        showFirstButton
        showLastButton
      />
      <Typography variant="caption" sx={{ mt: 0.5 }}>Page {page} of {totalPages}</Typography>
    </Stack>
  );
}
