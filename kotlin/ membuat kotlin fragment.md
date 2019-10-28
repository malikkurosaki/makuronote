# kotlin fragment 

```kotlin
package com.malikkurosaki.percobaankotlin.thefragment

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.malikkurosaki.percobaankotlin.R

class SatuFragment : Fragment(){

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val  view = inflater.inflate(R.layout.satu_fragment,container,false)
        return view;
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        init()
    }

    private fun init() {


    }


}


```


### pada akttivity

```kotlin
supportFragmentManager.beginTransaction().replace(containerUtama.id,SatuFragment()).commitAllowingStateLoss()

```
