---
path: /docs/misccpp/any/
---

# `futoin::any`

This is implementation of C++17 `std::any` with ensured optimization for small objects
and integration with `IMemPool`.

`futoin::any_cast` is provided as counterpart of `std::any_cast`.

## Usage

```cpp
#include <futoin/any.hpp>

void usage_example() {
    futoin::any var;
    
    var = 123;
    futoin::any_cast<int>(var);
    
    var = futoin::string{"string"};
    auto& s = futoin::any_cast<futoin::string>(var);
    
    using V = std::vector<int>;
    var = V{1,2,3};
    V& v = futoin::any_cast<V>(var);
}
```
