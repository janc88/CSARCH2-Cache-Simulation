# CSARCH2 Cache Simulation Project

## Overview

This project is designed as a web-based application that simulates the allocation of main memory blocks to their respective cache blocks using a Full Associative Mapping (FA) approach and First-In, First-Out (FIFO replacment algorithm.

In FA mapping, each main memory block may be mapped to any cache block, typically starting with block 0 and continuing to fill any available blocks. However, to handle instances wherein the cache blocks may need to be replaced or overwritten, a replacement algorithm is paired with this.

In this project, the FIFO replacement algorithm is utilized which allows the main memory blocks to continue placing its data in the cache blocks even when all cache blocks are exhausted or when data is already present in the cache. 

The project utilizes html, css and javascript in the creation of the application. Users would have the option to change the Main Memor Size, Cache Access Time, Memory Access Time, Sequence and the number of times for the sequence to be fetched. The project sets the default value of Cache Memory Size to 16 blocks and the Block Size to 32 words. Upon simulation, the application will show various results and output which are the number of cache hits and miss, hit and miss rates, memoryu access count, miss penalty, average access time and total access time. The project also provides a final memory snapshot of how the memory was placed in the cache as well as a step-by-step animated tracing for it. 

## Test Cases

The project also has a additional feature wherein three buttons named TC#1, TC#2 and TC#3 provides the user with 3 different test cases for better understanding and testing of the simulation

### Test Case 1 - Sequential Sequence

The first test case is a sequential sequence that is iterated four times and contains 2n or 32 (n=16) elements. The input for this would be
{0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31} for the sequence and 4 for the number of times fetched.
Since the sequence does not have any repeated data, the placing of memory blocks to cache is straightforward as after occuping the 16 blocks with elements
0 to 15, these would then be replaced by elements 16 to 31. Repeating the sequence four times would just repeat the process and the last result in each cache blocks 
would be occupied with each element from 16 to 31 respectively. 

### Test Case 2 - Random sequence

The second test case is a random sequence of various numbers containing 4n or 64 elements. The test case's sequence and number of times fetch for this would be{1,5,20,33,14,12,2,34,36,55,20,3,31,63,28,37,17,47,35,24,39,37,16,37,18,40,60,26,58,41,8,63,19,28,4,10,18,9,28,
16,12,32,24,31,35,19,40,60,29,5,20,45,11,48,22,18,24,45,1,29,16,50,10,12} and 1 respectively. This test case would give the user a better understanding of how the FA + FIFO replacment algorithm works in scenarios wherein there are repeated values and no vacant blocks left.

### Test Case 3 - Mid-repeat blocks

The third test case is a mid-repeat blocks which is essentially a sequence wherein the middle section of it gets repeated twice. This sequence starts at block 0, repeats the sequence twice until n-1 blocks and ends at 2n. This whole sequence would then be repeated four times. The project's test case for this would be {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31} for the sequence and 4 for the number of times for it to be repeated. This test case depicts a nested loop to a user and gives them a better understanding of how this specific situation works in mapping and replacing the cache blocks. 
