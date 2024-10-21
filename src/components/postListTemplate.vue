<script setup>
import PostTemplate from './postTemplate.vue';

defineProps({
  posts: Array
})

</script>

<template>
  <div v-auto-animate>
    <PostTemplate v-for="(post, index) in posts"
    :key="index"
    :name="post.name"
    :data="post.data"
    :time="post.time"
    :id="index"
    :threadId="post.threadId"
    :postId="post.postId"
    :url="post.url"
    :text="post.text"
    :theme="post.theme"
    :password="post.password"
    :day="post.day"
    :replies="post.replies"
    :mimeType="post.mimeType"
    />

  </div>
</template>