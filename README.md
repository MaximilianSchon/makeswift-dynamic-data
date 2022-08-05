# A makeswift proof of concept for fetching dyamic data at build time

The proof of concept is done with the help of lodash:s get-function and uses swr for data fetching. It works by creating a composite key which maps to an URI, a separator ("$$") and an object path. 

In the example the below spoof data is used.

```

const fetchFromEndpoint = (_key: string) => {

  return Promise.resolve(
    {
        "abc": "def",
        "def": [
          1, "2"
        ]
    }
  )

}


const preloaded: DataMapping = {
  
  '/': [
    '/data'
  ],
  '/protocols': []
}

```

The spoof data generates a fallback object for swr with the following strcuture 
```
{
    "/data$$abc": "def",
    "/data$$def[0]": 1,
    "/data$$def[1]": "2",
    "/data": {
        "abc": "def",
        "def": [
            1,
            "2"
        ]
    }
}
```

Note that for big objects with many nested fields it might be valueable to filter out some paths that you know you will not use. 

For example by using a filter function after the destructuring method.

The project includes two components for fetching data via Makeswift by entering a data-URI in the components. 