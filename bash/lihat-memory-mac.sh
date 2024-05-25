#!/bin/bash

# Get total memory, memory usage, and free memory
total_memory=$(sysctl -n hw.memsize)
used_memory=$(vm_stat | awk '/Pages active/ {print $3 * 4096}')
free_memory=$((total_memory - used_memory))

# Get total storage, disk usage, and free disk space
total_storage=$(df -h / | awk 'NR==2 {print $2}')
used_storage=$(df -h / | awk 'NR==2 {print $3}')
free_storage=$(df -h / | awk 'NR==2 {print $4}')

# Print both sets of information
echo "Memory:"
echo "Total: $total_memory"
echo "Used: $used_memory"
echo "Free: $free_memory"
echo
echo "Storage:"
echo "Total: $total_storage"
echo "Used: $used_storage"
echo "Free: $free_storage"
