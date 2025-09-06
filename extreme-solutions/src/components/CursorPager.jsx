import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CursorPager({
  pageIndex,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onFirst,
  supportsLast = false,
  hasLast = false,
  onLast,
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center" sx={{ my: 2 }}>
      <Button variant="outlined" size="small" onClick={onFirst} disabled={!hasPrev}>First</Button>
      <Button variant="outlined" size="small" onClick={onPrev} disabled={!hasPrev}>Previous</Button>
      <Typography variant="caption">Page {pageIndex}</Typography>
      <Button variant="outlined" size="small" onClick={onNext} disabled={!hasNext}>Next</Button>
      {supportsLast && (
        <Button variant="outlined" size="small" onClick={onLast} disabled={!hasLast}>Last</Button>
      )}
    </Stack>
  );
}
