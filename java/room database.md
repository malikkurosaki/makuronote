# database room 


### buat tabel class

```java
package dev.malikkurosaki.patungan.DbRoom;


import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

// @Entity(tableName = "tabel_Jenis",indices = {@Index(value = "id",unique = true)})
@Entity(tableName = "person")
public class PersonDb  {
    //@PrimaryKey(autoGenerate = true)
    @PrimaryKey
    private int id;
    @ColumnInfo(name = "name")
    private String nama;
    @ColumnInfo(name = "city")
    private String city;


    public PersonDb(){

    }


    public PersonDb(int id, String nama, String city) {
        this.id = id;
        this.nama = nama;
        this.city = city;
    }

    @Ignore
    public PersonDb(String nama, String city) {
        this.nama = nama;
        this.city = city;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}

```

### buat interface

```java
package dev.malikkurosaki.patungan.DbRoom;


import java.util.List;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

@Dao
public interface PersonDbDao {

    @Query("select * from person")
    List<PersonDb> getAllPerson();

    @Insert
    void insertPerson(PersonDb personDb);

    @Update
    void updatePerson(PersonDb personDb);

    @Delete
    void deletePerson(PersonDb personDb);
}
```

### buat database

```java
package dev.malikkurosaki.patungan.DbRoom;


import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

// @Database(entities = {Db.class,DB2.class,DB3.class},exportSchema = false ,version = 1)
@Database(entities = PersonDb.class,exportSchema = false ,version = 1)
public abstract class PersonDbRoom extends RoomDatabase {
    private static final String DB_NAME = "person_db";
    private static PersonDbRoom instance;

    public static synchronized PersonDbRoom getInstance(Context context){
        if (instance == null){
            instance = Room.databaseBuilder(context.getApplicationContext(),PersonDbRoom.class,DB_NAME).fallbackToDestructiveMigration().build();
        }

        return instance;
    }

    public abstract PersonDbDao personDbDao();
}

```

### implementasinya

```java
 AsyncTask.execute(()->{
            PersonDbRoom dbRoom = PersonDbRoom.getInstance(context);

            PersonDb personDb = new PersonDb();
            personDb.setId(1);
            personDb.setNama("malikkurosaki");
            personDb.setCity("denpasar");
            dbRoom.personDbDao().updatePerson(personDb);
            List<PersonDb> orang = dbRoom.personDbDao().getAllPerson();
            for (PersonDb db : orang){
                Log.i(TAG, "init: "+db.getId());
            }

        });
```


### dependencynya

```gradle
   // room database
    implementation "androidx.room:room-runtime:2.2.0"
    annotationProcessor "androidx.room:room-compiler:2.2.0"
```
