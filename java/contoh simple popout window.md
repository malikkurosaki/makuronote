<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [popout window simple](#popout-window-simple)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# popout window simple

```java

public static void ngepopInfo(Context context,View view){
        PopupWindow popupWindow = new PopupWindow(context);
        View layoutNya = LayoutInflater.from(context).inflate(R.layout.hasil_adapter,null);
        popupWindow.setContentView(layoutNya);
        popupWindow.setWidth(WindowManager.LayoutParams.WRAP_CONTENT);
        popupWindow.setHeight(WindowManager.LayoutParams.WRAP_CONTENT);
        popupWindow.setOutsideTouchable(true);
        popupWindow.setFocusable(true);
        popupWindow.showAsDropDown(view);


    }
    
    
```
