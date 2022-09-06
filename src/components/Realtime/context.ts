import { createContext } from 'react';
import type { Centrifuge } from 'centrifuge';

export const CentrifugeContext = createContext<Centrifuge | undefined>(undefined);
