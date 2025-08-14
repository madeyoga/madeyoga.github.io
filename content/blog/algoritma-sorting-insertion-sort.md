---
title: Algoritma Sorting - Insertion Sort
description: "Cara coding algoritma Insertion Sort menggunakan C/C++, C#, Java, Python."
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
    headline: "Algoritma Sorting - Insertion Sort"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2021-05-11"
---

![sorting algorithm art](https://res.cloudinary.com/dhqbr2d4l/image/upload/v1754981879/cumulation-154203_640_uxyxwc.png)

Image by [OpenClipart-Vectors](https://pixabay.com/users/openclipart-vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=154203) from [Pixabay](https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=154203)

**Insertion sort** merupakan algoritma pengurutan O(n2) yang memindahkan elemen satu per satu ke posisi yang benar. Algoritma berkerja dengan memasukkan satu elemen pada satu waktu ke bagian array yang diurutkan sebelumnya, memindahkan elemen dengan peringkat yang lebih tinggi ke atas sesuai kebutuhan. Awal mulai, elemen pertama (atau terkecil, atau sembarang) dari array yang tidak diurutkan dianggap sebagai bagian yang diurutkan.

Meskipun **Insertion Sort** adalah algoritma O(n2), kesederhanaannya, overhead rendah, lokalitas referensi yang baik, dan efisiensinya menjadikannya pilihan yang baik dalam dua kasus:
1. Ukuran array kecil,
2. Sebagai algoritma penyelesaian akhir untuk algoritma O (n logn) seperti mergesort dan quicksort.

## Contoh proses
- **12**, 11, 13, 5, 6

Contoh iterasikan i = 1 (elemen kedua pada array) hingga index 4 (elemen terakhir pada array)
i = 1. Karena 11 lebih kecil banding 12, maka masukan 11 dan geser posisi 12.

- **11**, **12**, 13, 5, 6

i = 2. 13 akan berada tetap pada posisinya, karena 13 lebih besar dari semua elemen array sebelumnya (11 dan 12).

- **11**, **12**, **13**, 5, 6

i = 3. 5 akan di pindah ke posisi paling awal, dan semua elemen sisahnya akan di geser 1x dari posisinya sekarang.

- **5**, **11**, **12**, **13**, 6

i = 4. 6 akan dipindah ke posisi setelah 5, dan elemen sisahnya dari 11 hingga 13 akan di geser 1x dari posisinya sekarang.

- **5**, **6**, **11**, **12**, **13**

Referensi: https://www.geeksforgeeks.org/insertion-sort/

## Berikut implementasi algoritma Insertion Sort di beberapa bahasa pemrograman

::tabs

::div{label="C/C++"}
```cpp
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void insertion_sort(int n, int* arr)
{
	int temp;
	for (int i = 0; i < n; i++)
	{
		int current_key = arr[i];

		for (int j = i - 1; j >= 0; j--)
		{
			if (current_key < arr[j])
			{
				// swap
				temp = arr[j + 1];
				arr[j + 1] = arr[j];
				arr[j] = temp;
			}
			else
			{
				break;
			}
		}
	}
}

int main()
{
	int arr_length = 100;
	int arr[100];

	srand(time(0));

	// Add random numbers to array
	for (int i = 0; i < arr_length; i++)
	{
		// Get number in range 0 - 100;
		int num = (rand() % (100 - 0 + 1)) + 0;
		arr[i] = num;
		printf("%d ", arr[i]);
	}

	insertion_sort(arr_length, arr);

	printf("\n\nSorted Array: \n");

	// print array
	for (int i = 0; i < arr_length; i++)
	{
		printf("%d ", arr[i]);
	}

	return 0;
}
```
::

::div{label="C#"}
```csharp
using System;
using System.Collections.Generic;
using System.Text;

namespace Test
{
    static class Program
    {
        static void Main(string[] args)
        {
            // deklarasi variable 
            var rand = new Random(0);
            var arr = new List<int>();

            // isi array dengan random data
            for (var i = 0; i < 10; i++)
            {
                arr.Add(rand.Next() % 100);
            }

            // tampilakan isi array
            Console.WriteLine("Array sebelum sorting:");
            for (var i = 0; i < arr.Count; i++)
            {
                Console.WriteLine(arr[i]);
            }
            Console.WriteLine();

            // memanggil Method InsertionSort()
            arr.InsertionSort();

            // tampilakan isi array setelah di sorting
            Console.WriteLine("Array sesudah sorting:");
            for (var i = 0; i < arr.Count; i++)
            {
                Console.WriteLine(arr[i]);
            }
            Console.WriteLine();
            Console.ReadLine();
        }

        public static void InsertionSort(this List<int> arr)
        {
            int temp; 
            int key;

            for (var i = 0; i < arr.Count; i++)
            {
                key = arr[i];
                for (var j = i - 1; j >= 0; j--)
                {
                    if (key < arr[j])
                    {
                        // swap
                        temp = arr[j + 1];
                        arr[j + 1] = arr[j];
                        arr[j] = temp;
                    }
                }
            }
        }
    }
}
```
::

::div{label="Java"}
```java
import java.util.Random;

public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int temp;
        for (int i = 0; i < arr.length; i++) {
            int currentKey = arr[i];
            for (int j = i - 1; j >= 0; j--) {
                if (currentKey < arr[j]) {
                    // swap
                    temp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] arr = new int[25];

        // Generate random array
        Random rand = new Random();

        // Add random numbers to array
        for (int i = 0; i < arr.length; i++) {
            // Generate random number from 0 to 99;
            int number = rand.nextInt(100);
            arr[i] = number;
            System.out.print(arr[i] + " ");
        }

        insertionSort(arr);
        System.out.println("\n\nSorted Array:");

        // print sorted array
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}
```
::

::div{label="Python"}
```python
import numpy as np
from random import shuffle


def insertion_sort(array):
    for i in range(len(array)):
        current_key = array[i]
        # Loop from i - 1 to 0
        for j in range(i - 1, -1, -1):
            if current_key < array[j]:
                array[j + 1], array[j] = array[j], array[j + 1]
            else:
                break
    return array


# Buat array berisi 0 sampai 999
random_array = np.arange(1000)

# Acak isi array
shuffle(random_array)

print(random_array)

print(insertion_sort(random_array))
```
::

::

Link github https://github.com/madeyoga/SortingAlgorithms

Semoga bermanfaat :pray:
