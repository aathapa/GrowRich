package com.expense;

import android.os.Bundle; 
import org.devio.rn.splashscreen.SplashScreen;

import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {
   @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(savedInstanceState);
    }
  
}