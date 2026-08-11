import type { Libro } from '../types';
import { torah } from './torah';
import { storici } from './storici';
import { sapienziali } from './sapienziali';
import { profeti } from './profeti';
import { manoscritti } from './manoscritti';
import { nuovoTestamento } from './nuovo_testamento';

export const LIBRI: Libro[] = [
  ...torah,
  ...storici,
  ...sapienziali,
  ...profeti,
  ...manoscritti,
  ...nuovoTestamento
];