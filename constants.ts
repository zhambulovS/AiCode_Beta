import { Problem } from './types';

export const LEADERBOARD_DATA = [
  { rank: 1, name: "Aliya S.", country: "KZ", solved: 142, points: 2840, badge: "Barys" },
  { rank: 2, name: "Berik K.", country: "KZ", solved: 138, points: 2750, badge: "Tulpar" },
  { rank: 3, name: "John D.", country: "US", solved: 120, points: 2400, badge: "Eagle" },
  { rank: 4, name: "Saule M.", country: "KZ", solved: 115, points: 2300, badge: "Tulpar" },
  { rank: 5, name: "Arman T.", country: "KZ", solved: 98, points: 1950, badge: "Nomad" },
  { rank: 6, name: "Dmitry V.", country: "RU", solved: 95, points: 1900, badge: "Bear" },
  { rank: 7, name: "Gulnaz R.", country: "KZ", solved: 88, points: 1760, badge: "Nomad" },
  { rank: 8, name: "Sarah J.", country: "UK", solved: 80, points: 1600, badge: "Lion" },
];

export const PROBLEMS: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    starterCode: "def two_sum(nums, target):\n    # Your code here\n    pass",
    testCases: "Input: nums = [2,7,11,15], target = 9 -> Output: [0,1]. Input: [3,2,4], 6 -> [1,2]."
  },
  {
    id: "2",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with O(1) extra memory.",
    starterCode: "def reverse_string(s):\n    # Your code here\n    pass",
    testCases: "Input: ['h','e','l','l','o'] -> ['o','l','l','e','h']"
  },
  {
    id: "3",
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: "Given an integer `x`, return `true` if `x` is a palindrome integer. An integer is a palindrome when it reads the same backward as forward.",
    starterCode: "def is_palindrome(x):\n    return False",
    testCases: "Input: 121 -> True. Input: -121 -> False. Input: 10 -> False."
  },
  {
    id: "4",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order.",
    starterCode: "def is_valid(s):\n    pass",
    testCases: "Input: '()' -> True. Input: '()[]{}' -> True. Input: '(]' -> False."
  },
  {
    id: "5",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists in a one sorted list.",
    starterCode: "def merge_two_lists(list1, list2):\n    pass",
    testCases: "Input: [1,2,4], [1,3,4] -> [1,1,2,3,4,4]"
  },
  {
    id: "6",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day. Maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    starterCode: "def max_profit(prices):\n    return 0",
    testCases: "Input: [7,1,5,3,6,4] -> 5. Input: [7,6,4,3,1] -> 0"
  },
  {
    id: "7",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    starterCode: "def is_anagram(s, t):\n    return False",
    testCases: "Input: s='anagram', t='nagaram' -> True"
  },
  {
    id: "8",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.",
    starterCode: "def search(nums, target):\n    return -1",
    testCases: "Input: [-1,0,3,5,9,12], 9 -> 4"
  },
  {
    id: "9",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "DP",
    description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    starterCode: "def max_sub_array(nums):\n    return 0",
    testCases: "Input: [-2,1,-3,4,-1,2,1,-5,4] -> 6 (subarray [4,-1,2,1])"
  },
  {
    id: "10",
    title: "Rotate Array",
    difficulty: "Medium",
    category: "Array",
    description: "Given an array, rotate the array to the right by `k` steps, where `k` is non-negative.",
    starterCode: "def rotate(nums, k):\n    pass",
    testCases: "Input: [1,2,3,4,5,6,7], k=3 -> [5,6,7,1,2,3,4]"
  },
  {
    id: "11",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "String",
    description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    starterCode: "def group_anagrams(strs):\n    return []",
    testCases: "Input: ['eat','tea','tan','ate','nat','bat'] -> [['bat'],['nat','tan'],['ate','eat','tea']]"
  },
  {
    id: "12",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Array",
    description: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    starterCode: "def longest_consecutive(nums):\n    return 0",
    testCases: "Input: [100,4,200,1,3,2] -> 4 ([1,2,3,4])"
  },
  {
    id: "13",
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
    starterCode: "def three_sum(nums):\n    return []",
    testCases: "Input: [-1,0,1,2,-1,-4] -> [[-1,-1,2],[-1,0,1]]"
  },
  {
    id: "14",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    starterCode: "def max_area(height):\n    return 0",
    testCases: "Input: [1,8,6,2,5,4,8,3,7] -> 49"
  },
  {
    id: "15",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    starterCode: "def length_of_longest_substring(s):\n    return 0",
    testCases: "Input: 'abcabcbb' -> 3. Input: 'bbbbb' -> 1"
  },
  {
    id: "16",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "DP",
    description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    starterCode: "def climb_stairs(n):\n    return 0",
    testCases: "Input: 2 -> 2. Input: 3 -> 3"
  },
  {
    id: "17",
    title: "House Robber",
    difficulty: "Medium",
    category: "DP",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob two adjacent houses. Return the max money you can rob.",
    starterCode: "def rob(nums):\n    return 0",
    testCases: "Input: [1,2,3,1] -> 4. Input: [2,7,9,3,1] -> 12"
  },
  {
    id: "18",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. O(n) time, no division.",
    starterCode: "def product_except_self(nums):\n    pass",
    testCases: "Input: [1,2,3,4] -> [24,12,8,6]"
  },
  {
    id: "19",
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    starterCode: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def getMin(self):\n        pass",
    testCases: "Logical check of stack operations."
  },
  {
    id: "20",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Tree",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    starterCode: "def is_valid_bst(root):\n    return True",
    testCases: "Input: [2,1,3] -> True. Input: [5,1,4,null,null,3,6] -> False"
  },
  {
    id: "21",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.",
    starterCode: "def num_islands(grid):\n    return 0",
    testCases: "Standard islands grid inputs."
  },
  {
    id: "22",
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graph",
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites`. Return `true` if you can finish all courses.",
    starterCode: "def can_finish(numCourses, prerequisites):\n    return True",
    testCases: "Input: 2, [[1,0]] -> True. Input: 2, [[1,0],[0,1]] -> False"
  },
  {
    id: "23",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array",
    description: "Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals.",
    starterCode: "def merge(intervals):\n    return []",
    testCases: "Input: [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]"
  },
  {
    id: "24",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Heap",
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
    starterCode: "def top_k_frequent(nums, k):\n    return []",
    testCases: "Input: [1,1,1,2,2,3], 2 -> [1,2]"
  },
  {
    id: "25",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    starterCode: "def invert_tree(root):\n    return root",
    testCases: "Input: [4,2,7,1,3,6,9] -> [4,7,2,9,6,3,1]"
  },
  {
    id: "26",
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    category: "Tree",
    description: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    starterCode: "def kth_smallest(root, k):\n    return 0",
    testCases: "Input: [3,1,4,null,2], k=1 -> 1"
  },
  {
    id: "27",
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Stack",
    description: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the ith day to get a warmer temperature.",
    starterCode: "def daily_temperatures(temperatures):\n    pass",
    testCases: "Input: [73,74,75,71,69,72,76,73] -> [1,1,4,2,1,1,0,0]"
  },
  {
    id: "28",
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    starterCode: "def subsets(nums):\n    return [[]]",
    testCases: "Input: [1,2,3] -> [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
  },
  {
    id: "29",
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
    starterCode: "def permute(nums):\n    return []",
    testCases: "Input: [1,2,3] -> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
  },
  {
    id: "30",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    starterCode: "def find_median_sorted_arrays(nums1, nums2):\n    return 0.0",
    testCases: "Input: [1,3], [2] -> 2.0. Input: [1,2], [3,4] -> 2.5"
  }
];