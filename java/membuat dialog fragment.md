# dialog fragment 

```java
package probus.malikkurosaki.probussystem;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import butterknife.BindView;

public class Helper_Dialog_fragmen extends DialogFragment {

    @BindView(R.id.iniItu)
    TextView iniItu;
    private DariDialogFragment dariDialogFragment;
    private String nama;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof DariDialogFragment) {
            dariDialogFragment = (DariDialogFragment) context;
        } else {
            try {
                throw new IllegalAccessException("harus di implement");
            } catch (IllegalAccessException e) {
                e.printStackTrace();

                Log.i("tangnya", "onAttach: " + e);
            }
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle(DialogFragment.STYLE_NORMAL, R.style.DialogFragment_custom);
    }

    @Override
    public void onStart() {
        super.onStart();

        Dialog dialog = getDialog();
        if (dialog != null) {
            int width = ViewGroup.LayoutParams.MATCH_PARENT;
            int height = ViewGroup.LayoutParams.MATCH_PARENT;

            dialog.getWindow().setLayout(width, height);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.helperdialog_fragment, container, false);

        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toast.makeText(getContext(),nama,Toast.LENGTH_LONG).show();

        if (dariDialogFragment == null){
            Toast.makeText(getContext(),"ya",Toast.LENGTH_LONG).show();
        }

    }

    public void setDariDialogFragment(DariDialogFragment dariDialogFragment) {
        this.dariDialogFragment = dariDialogFragment;
    }


    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getNama() {
        return nama;
    }

    interface DariDialogFragment {
        void maka(String nama);
    }
}
```

## custom stylenya
```xml
 <style name="DialogFragment_custom" parent="android:Theme">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowIsFloating">false</item>
    </style>
```

### update tambahan
```java
 @Override
    public int getTheme() {
        return R.style.DialogFragment_custom;
    }
```


### update

```java
 @Override
    public int getTheme() {
        return R.style.CustomDialog;
    }
    
```
