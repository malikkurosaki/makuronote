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

