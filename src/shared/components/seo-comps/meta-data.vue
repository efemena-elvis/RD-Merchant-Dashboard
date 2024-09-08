<template>
  <Head>
    <html :lang="getMetaLocales.current" />
    <meta property="og:locale" :content="getMetaLocales.current" />
    <meta
      v-for="locale in getMetaLocales.other"
      :key="locale"
      property="og:locale:alternate"
      :content="locale"
    />
    <!-- Page Title -->
    <title>{{ getMetaTitle }}</title>

    <!-- Description -->
    <meta name="description" :content="getMetaDescription" />

    <!-- Keywords -->
    <meta name="keywords" :content="metaKeywords" />

    <!-- Authors -->
    <meta name="author" :content="metaCompanyName" />
    <link rel="author" :href="metaCompanyBaseUrl" />
    <meta name="creator" :content="metaCompanyCreator" />

    <!-- Canonical and Language Alternates -->
    <link rel="canonical" :href="metaCompanyBaseUrl" />
    <link rel="alternate" hreflang="en-US" href="/en-US" />
  </Head>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Head } from "@vueuse/head";

const route = useRoute();
const metaTitle = "Redstone Merchant Office";
const metaDescription =
  "RedstonePGS offers seamless and secure payment gateway services for mobile money, card payments, and bank transfers. We ensure your transactions are fraud-free, collected efficiently, and settled on time. Discover reliable payment solutions with RedstonePGS.";
const metaKeywords =
  "RedstonePGS, payment gateway service, secure payment solutions, mobile money payments, card payment gateway, bank transfer solutions, fraud-free payment service, seamless payment processing, timely payment settlement, online payment solutions";
const metaCompanyName = "RedstonePGS Technology Limited";
const metaCompanyCreator = "Efemena Elvis";
const metaCompanyBaseUrl = "https://www.redstonepgs.com";

const getMetaLocales = computed(() => ({
  current: "en",
  other: ["fr", "es"],
}));

const getTitleText = computed(() =>
  route.meta.title ? `${route.meta.title} -` : ""
);

const getMetaTitle = computed(
  () => `${getTitleText.value} Redstone` || metaTitle
);

const getMetaDescription = computed(() => {
  const { description } = route.meta;
  return typeof description === "string" ? description : metaDescription;
});
</script>
