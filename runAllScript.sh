#!/bin/bash

concurrently \
  "cd simple-log-backend && npm run dev" \
  "cd simple-log-backend && npm run db:studio" \
  "cd simple-log-frontend && npm run dev"