<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [mendapatkan info wifi hotspot](#mendapatkan-info-wifi-hotspot)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# mendapatkan info wifi hotspot

```java
 public String getHotspotAdress(){
        final WifiManager wifiManager = (WifiManager)super.getApplicationContext().getSystemService(WIFI_SERVICE);
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        final DhcpInfo dhcp = wifiManager.getDhcpInfo();
        int ipAddress = dhcp.gateway;
        ipAddress = (ByteOrder.nativeOrder().equals(ByteOrder.LITTLE_ENDIAN)) ?
                Integer.reverseBytes(ipAddress) : ipAddress;
        byte[] ipAddressByte = BigInteger.valueOf(ipAddress).toByteArray();
        try {
            InetAddress myAddr = InetAddress.getByAddress(ipAddressByte);
            Log.i("ipnya", "getHotspotAdress: getBSSID"+wifiInfo.getBSSID());
            Log.d("ipnya", "getHotspotAdress: getSSID"+wifiInfo.getSSID());
            Log.d("ipnya", "getHotspotAdress: getIpAddress"+wifiInfo.getIpAddress());
            return myAddr.getHostAddress();
        } catch (UnknownHostException e) {
            // TODO Auto-generated catch block
            Log.e("Wifi Class", "Error getting Hotspot IP address ", e);
        }
        return "null";
    }
  ```
