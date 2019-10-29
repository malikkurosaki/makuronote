# menangani gak mau install saat debug


```java
6

check 4 ways:

way 1: turn off Instant Run

File > Settings > Build,Execution,Deployment > Instant Run > Un-check (Enable Instant Run to hot swap code)

way 2: Go to Build --> Clean Project and Run again

way 3: For those who use Xiaomi phones, follow these steps:

Settings-> Additional Settings-> Developer opetions

Turn off MIUI Optimization and reboot your phone

Last Disable verify app over USB
way 4: Run Invalidate caches/restart in android studio

Choose the File option in windows and preference in mac
Select Invalidate caches/restart.
Click Invalidate and restart.

```
