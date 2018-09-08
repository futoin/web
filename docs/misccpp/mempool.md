---
path: /docs/misccpp/mempool/
---

# Memory Management for C++

Both modern glibc and gperftools malloc implementations are quite fast and may show even better
results for some use cases. However, FutoIn API provides `futoin::IMemPool` interface to support
implementation-defined way to optimize object allocation and/or control memory usage.

`IMemPool::Allocator<T>` is compatible with standard C++ library allocator interface. It can be
used in any container and standalone. Unless explicitly provided, a global thread-local pointer
to `IMemPool` instance is used. It is set to standard heap implementation by default.

General idea is that `IAsyncTool` instance can set own custom memory pool for its event loop thread.
Such memory pool may disable any synchronization overhead (~20-30% boost in some tests) and/or
use dedicated pools per object size to minimize fragmentation of heap and improve performance.

It's possible to create static object of `IMemPool::Allocator<T>::EnsureOptimized` type in
any part of the program. This will trigger special logic to try to use special memory pools
optimize for `sizeof(T)`, if supported by implementation.

The minor drawback is that each container instance grows for `sizeof(void*)` as allocator
instance holds pointer to associated memory pool instance. That's not critical in most cases.

## Usage

```cpp
#include <futoin/imempool.hpp>

class MyMemPool : public IMemPool {};

// Define static object or call anywhere in program.
// All Allocators created after this initialization will try to
// request optimized memory pool.
IMemPool::Allocator<int>::EnsureOptimized ensure_int_allocation_is_optimized;

void usage_example() {
    MyMemPool my_mem_pool;
    futoin::GlobalMemPool::set_thread_default(my_mem_pool);

    using Alloc = futoin::IMemPool::Allocator<int>;
    
    // Use thread default 
    std::vector<int, Alloc> vec;
    
    // Other mem pool
    MyMemPool other_mem_pool;
    std::vector<int, Alloc> vec{Alloc(other_mem_pool)};
    
    // No RAII helper as it should not be used by business logic
    futoin::GlobalMemPool::reset_thread_default();
}
```

## API

```cpp
namespace futoin {
    struct IMemPool {
        
        //...

        virtual void* allocate(
                std::size_t object_size, std::size_t count) noexcept = 0;

        virtual void deallocate(
                void* ptr,
                std::size_t object_size,
                std::size_t count) noexcept = 0;

        // act as shrink_to_fit()
        virtual void release_memory() noexcept = 0;

        // Allocator uses it on construct
        virtual IMemPool& mem_pool(
                std::size_t /*object_size*/ = 1,
                bool /*optimize*/ = false) noexcept
        {
            return *this;
        }
        
        template<typename T>
        struct Allocator;
        
        //...
    };

    // Interface to manipulate threadlocal pointer.
    struct GlobalMemPool {
        inline static IMemPool& get_default() noexcept;
        inline static IMemPool& get_common() noexcept;
        inline static void set_thread_default(IMemPool& mem_pool) noexcept;
        inline static void reset_thread_default() noexcept;
    };
}
```
