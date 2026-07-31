#!/bin/sh
set -e

bash check.sh
bash health.sh

echo "All checks and health checks passed"
