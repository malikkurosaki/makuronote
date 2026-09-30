<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [android mendapatkan date time wakru](#android-mendapatkan-date-time-wakru)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# android mendapatkan date time wakru

```java
private String getDateTime() {
        SimpleDateFormat dateFormat = new SimpleDateFormat(
                "yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        Date date = new Date();
        return dateFormat.format(date);
}
```

```java
return new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
```

