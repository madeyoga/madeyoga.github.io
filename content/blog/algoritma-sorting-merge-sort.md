---
title: Algoritma Sorting - Merge Sort
description: "Cara coding algoritma Merge Sort menggunakan C/C++, C#, Java, JavaScript, Python, PHP."
image:
  src: https://res.cloudinary.com/dhqbr2d4l/image/upload/v1754981879/cumulation-154203_640_uxyxwc.png
authors:
  - name: Made Y
    to: https://madeyoga.github.io
    avatar:
      src: /images/profile2.jpg
date: 2021-05-11
badge:
  label: Data Structure

sitemap:
  lastmod: 2025-08-12
schemaOrg:
  - type: "BlogPosting"
    headline: "Algoritma Sorting - Merge Sort"
    author:
      type: "Person"
      name: "Made Y"
    datePublished: "2021-05-11"
---

![sorting art](https://res.cloudinary.com/dhqbr2d4l/image/upload/v1754981879/cumulation-154203_640_uxyxwc.png)
<small>Image by [OpenClipart-Vectors](https://pixabay.com/users/openclipart-vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=154203) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=154203)</small>

## Apa itu Merge Sort?

**Merge Sort** adalah algoritma [Divide and Conquer](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm). Algoritma Merge Sort membagi array input menjadi dua bagian. Secara **terus menerus** (recursive), memanggil fungsi dirinya sendiri untuk **membagi array menjadi 2 bagian hingga didapat array berisi 1 elemen**. Berikutnya dua bagian array tersebut diurutkan dan digabungkan secara bersamaan hingga membentuk 1 array yang telah terurut. Berikut visualisasi algoritma merge sort:

![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Merge_sort_algorithm_diagram.svg/499px-Merge_sort_algorithm_diagram.svg.png)
<small>Source: [Wikipedia](https://en.wikipedia.org/wiki/File:Merge_sort_algorithm_diagram.svg)</small>

1. **Ilustrasi warna merah**: algoritma merge sort terus membagi array menjadi 2 bagian.
2. **Ilustrasi warna abu-abu**: algoritma telah **selesai membagi array**, dan didapat array berisi 1 elemen (Tidak bisa dibagi lagi). Pada contoh tersebut terdapat 7 array berisi 1 elemen.
3. **Ilustrasi warna hijau**: algoritma mulai membandingkan elemen dari ke 2 bagian array untuk diurut dan digabungkan.

Dibanding algoritma sorting lainnya seperti [Bubble Sort](https://articlearn.id/article/d9c6ad4a-algoritma-sorting-bubble-sort/?list=QyiCae3e), [Insertion Sort](https://articlearn.id/article/527c548c-algoritma-sorting-insertion-sort/?list=QyiCae3e), dan [Selection Sort](https://articlearn.id/article/f427a277-algoritma-sorting-selection-sort/?list=QyiCae3e). Algoritma Merge Sort sangat cepat dan dapat digunakan untuk mengurutkan array dalam ukuran yang besar, dengan [time complexity](https://en.wikipedia.org/wiki/Time_complexity) O(nLogn).

## Implementasi Algoritma Merge Sort
Berikut implementasi algoritma Merge Sort di beberapa bahasa pemrograman:


::tabs

::div{label="C"}
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>


void merge_sort_c(int* arr, int left, int right)
{
	if (right > left)
	{
		int middle = left + (right - left) / 2;

		merge_sort_c(arr, left, middle);
		merge_sort_c(arr, middle + 1, right);

		// prepare for merge
		const int left_length = middle - left + 1;
		const int right_length = right - middle;

		// temporary subarray
		int* left_array = new int[left_length];
		int* right_array = new int[right_length];
		for (int i = 0; i < left_length; i++) 
		{
			left_array[i] = arr[left + i];
		}
		for (int i = 0; i < right_length; i++)
		{
			right_array[i] = arr[middle + i + 1];
		}

		// merge
		int left_pointer = 0;
		int right_pointer = 0;
		int main_pointer = left;

		while (left_pointer < left_length && right_pointer < right_length)
		{
			int left_value = left_array[left_pointer];
			int right_value = right_array[right_pointer];

			if (left_value < right_value)
			{
				arr[main_pointer] = left_value;
				left_pointer += 1;
			}
			else
			{
				arr[main_pointer] = right_value;
				right_pointer += 1;
			}
			main_pointer += 1;
		}

		while (left_pointer < left_length)
		{
			arr[main_pointer] = left_array[left_pointer];
			left_pointer += 1;
			main_pointer += 1;
		}

		while (right_pointer < right_length)
		{
			arr[main_pointer] = right_array[right_pointer];
			right_pointer += 1;
			main_pointer += 1;
		}

		// Free memory
		delete[] left_array, right_array;
	}
}


int main()
{
	int arr_length = 1000000;

	int* arr = new int[arr_length]; // (int*) malloc(arr_length * sizeof(int));

	srand(time(0));

	// Add random numbers to array
	for (int i = 0; i < arr_length; i++)
	{
		// Get number in range 0 - arr_length;
		int num = (rand() % (arr_length - 0 + 1)) + 0;
		arr[i] = num;

		//printf("%d ", arr[i]);
	}

	printf("\n");

	clock_t t;
	t = clock();

	printf("Sorting %d data...\n\n", arr_length);

	merge_sort_c(arr, 0, arr_length - 1);

	t = clock() - t;
	double time_taken = ((double)t) / CLOCKS_PER_SEC; // calculate the elapsed time
	printf("Sorting took %f seconds to complete\n\n", time_taken);

	delete[] arr;
	arr = NULL;

	return 0;
}
```
::

::div{label="C++"}
```cpp
#include <iostream>
#include <vector>

std::vector<int> merge_sort(std::vector<int> arr)
{
	int length = arr.size();

	if (length == 1)
	{
		return arr;
	}

	int middle = length / 2;

	std::vector<int> sorted_left = merge_sort(std::vector<int>(arr.begin(), arr.begin() + middle));
	std::vector<int> sorted_right = merge_sort(std::vector<int>(arr.begin() + middle, arr.end()));

	int left_length = sorted_left.size();
	int right_length = sorted_right.size();

	int left_pointer = 0, right_pointer = 0, main_pointer = 0;

	std::vector<int> temp_vector(length);

	while (left_pointer < left_length && right_pointer < right_length)
	{
		int left_value = sorted_left[left_pointer];
		int right_value = sorted_right[right_pointer];

		if (left_value < right_value)
		{
			temp_vector[main_pointer] = left_value;
			left_pointer += 1;
		}
		else
		{
			temp_vector[main_pointer] = right_value;
			right_pointer += 1;
		}
		main_pointer += 1;
	}

	while (left_pointer < left_length)
	{

		temp_vector[main_pointer] = sorted_left.at(left_pointer);
		left_pointer += 1;
		main_pointer += 1;
	}

	while (right_pointer < right_length)
	{
		temp_vector[main_pointer] = sorted_right.at(right_pointer);
		right_pointer += 1;
		main_pointer += 1;
	}

	return temp_vector;
}
```
::

::div{label="C#"}
```csharp
public static void Main(string[] args)
{
    var randomArray = new int[21];
    var random = new Random(0);

    for (var i = 0; i < 20; i++)
    {
        randomArray[i] = random.Next() % 100;
        ;
    }

    Console.WriteLine("Array sebelum di sorting.");
    Console.WriteLine(string.Join(", ", randomArray));
    Console.WriteLine();

    MergeSort(randomArray, 0, randomArray.Length - 1);

    Console.WriteLine("Array sesudah di sorting.");
    Console.WriteLine(string.Join(", ", randomArray));
}

private static void Merge(int[] input, int left, int middle, int right)
{
    int[] leftArray = new int[middle - left + 1];
    int[] rightArray = new int[right - middle];

    Array.Copy(input, left, leftArray, 0, middle - left + 1);
    Array.Copy(input, middle + 1, rightArray, 0, right - middle);

    int i = 0;
    int j = 0;
    for (int k = left; k < right + 1; k++)
    {
        if (i == leftArray.Length)
        {
            input[k] = rightArray[j];
            j++;
        }
        else if (j == rightArray.Length)
        {
            input[k] = leftArray[i];
            i++;
        }
        else if (leftArray[i] <= rightArray[j])
        {
            input[k] = leftArray[i];
            i++;
        }
        else
        {
            input[k] = rightArray[j];
            j++;
        }
    }
}

private static void MergeSort(int[] input, int left, int right)
{
    if (left < right)
    {
        int middle = (left + right) / 2;

        MergeSort(input, left, middle);
        MergeSort(input, middle + 1, right);

        Merge(input, left, middle, right);
    }
}
```
::

::div{label="Java"}
```java
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MergeSort {

    public static List<Integer> mergeSort(List<Integer> list) {
        int middle = list.size() / 2;

        List<Integer> leftArray = list.subList(0, middle);
        List<Integer> rightArray = list.subList(middle, list.size());

        List<Integer> sortedLeft = leftArray;
        List<Integer> sortedRight = rightArray;

        if (leftArray.size() > 1)
            sortedLeft = mergeSort(leftArray);

        if (rightArray.size() > 1)
            sortedRight = mergeSort(rightArray);

        int leftPointer = 0;
        int rightPointer = 0;

        // merge
        List<Integer> tempMergedArray = new ArrayList<>();
        while (leftPointer < sortedLeft.size() && rightPointer < sortedRight.size()) {
            int leftValue = sortedLeft.get(leftPointer);
            int rightValue = sortedRight.get(rightPointer);

            if (leftValue < rightValue) {
                tempMergedArray.add(leftValue);
                leftPointer += 1;
            }
            else {
                tempMergedArray.add(rightValue);
                rightPointer += 1;
            }
        }

        while (leftPointer < sortedLeft.size()) {
            tempMergedArray.add(sortedLeft.get(leftPointer));
            leftPointer += 1;
        }

        while (rightPointer < sortedRight.size()) {
            tempMergedArray.add(sortedRight.get(rightPointer));
            rightPointer += 1;
        }

        return tempMergedArray;
    }

    public static void main(String[] args) {
        List<Integer> arr = new ArrayList<>();

        int nData = 25;

        Random rand = new Random();
        // Add random numbers to array list
        for (int i = 0; i < nData; i++) {
            // Generate random number from 0 to 99;
            int number = rand.nextInt(100);
            arr.add(number);
            System.out.print(arr.get(i) + " ");
        }
        System.out.println();

        List<Integer> sortedArray = mergeSort(arr);

        System.out.println("SortedArray:");
        for (int i = 0; i < sortedArray.size(); i++) {
            System.out.print(sortedArray.get(i) + " ");
        }
    }
}

```
::

::div{label="JavaScript"}
```javascript
function mergeSort(array) {
	if (array.length == 1) {
		return array;
	}

	var middle = Math.floor(array.length / 2);

	var leftArray = array.slice(0, middle);
	var rightArray = array.slice(middle, array.length);

	var sortedLeft = mergeSort(leftArray);
	var sortedRight = mergeSort(rightArray);

	var leftPointer = 0;
	var rightPointer = 0;

	let tempList = [];
	while (leftPointer < sortedLeft.length && rightPointer < sortedRight.length) {
		left = sortedLeft[leftPointer];
		right = sortedRight[rightPointer];

		if (left > right) {
			tempList.push(right);
			rightPointer += 1;
		}
		else {
			tempList.push(left);
			leftPointer += 1;
		}
	}

	while (leftPointer < sortedLeft.length) {
		tempList.push(sortedLeft[leftPointer]);
		leftPointer += 1;
	}

	while (rightPointer < sortedRight.length) {
		tempList.push(sortedRight[rightPointer]);
		rightPointer += 1;
	}

	return tempList;
}

let array = [];

dataLength = 10000

for (var i = 0; i < dataLength; i++) {
	// Get random number from 1 to dataLength
	var randomNumber = i;
	array.push(randomNumber);
}

// shuffle array
array = array.sort(() => Math.random() - 0.5)

console.log(array);

sortedArray = mergeSort(array);

console.log(sortedArray);

```
::

::div{label="Python"}
```python
def merge_sort(arr):
    if len(arr) == 1:
        return arr

    middle = len(arr) // 2

    sorted_left = merge_sort(arr[:middle])
    sorted_right = merge_sort(arr[middle:])

    left_pointer = 0
    right_pointer = 0

    left_len = len(sorted_left)
    right_len = len(sorted_right)

    # Merge
    temp_list = []
    while left_pointer < left_len and right_pointer < right_len:
        left = sorted_left[left_pointer]
        right = sorted_right[right_pointer]

        if left > right:
            temp_list.append(right)
            right_pointer += 1
        else:
            temp_list.append(left)
            left_pointer += 1

    if left_pointer < left_len:
        temp_list.extend(sorted_left[left_pointer:])

    if right_pointer < right_len:
        temp_list.extend(sorted_right[right_pointer:])

    return temp_list
```
::

::div{label="PHP"}
```php
function merge_sort($array){
	if(count($array) == 1 ) {
		return $array;
	}

	$middle = count($array) / 2;

    $left = array_slice($array, 0, $middle);
    $right = array_slice($array, $middle);

	$left = merge_sort($left);
	$right = merge_sort($right);

	$temp_array = array();
	while (count($left) > 0 && count($right) > 0){
		if($left[0] < $right[0]){
			$temp_array[] = $left[0];
			$left = array_slice($left, 1);
		}
		else{
			$temp_array[] = $right[0];
			$right = array_slice($right , 1);
		}
	}
	while (count($left) > 0){
		$temp_array[] = $left[0];
		$left = array_slice($left, 1);
	}
	while (count($right) > 0){
		$temp_array[] = $right[0];
		$right = array_slice($right, 1);
	}
	return $temp_array;
}
```
::

::
