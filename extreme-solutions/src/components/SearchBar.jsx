import { useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import debounce from '../utils/debounce';

export default function SearchBar({ onSearch, placeholder = 'Search users…', delay = 300 }) {
  const [value, setValue] = useState('');

  const debouncedSearch = useMemo(() => debounce(onSearch, delay), [onSearch, delay]);

  return (
    <TextField
      fullWidth
      size="small"
      label={placeholder}
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        debouncedSearch(v.trim());
      }}
      variant="outlined"
    />
  );
}

