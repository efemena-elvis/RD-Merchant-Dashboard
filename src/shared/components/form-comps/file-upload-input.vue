<template>
  <div class="upload-field-input">
    <label :for="id">
      <div class="flex justify-center items-center gap-x-2">
        <div class="icon icon-upload text-xl text-grey-600/80"></div>
        <div>Click here to upload your file</div>
      </div>
    </label>

    <input
      type="file"
      :id="id"
      ref="fileUpload"
      class="hidden"
      accept=".jpg, .jpeg, .png, .pdf"
    />
  </div>

  <!-- SKIP ROW -->
  <div class="skip-row" v-if="showSkip">
    Don’t have these documents ready?
    <span @click="goToSkipRoute">Skip and upload later</span>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

interface IFileUploadType {
  id: string;
  showSkip: boolean;
  skipRoute: string;
}

const props = withDefaults(defineProps<IFileUploadType>(), {
  id: "fileUpload",
  showSkip: false,
  skipRoute: "",
});

const router = useRouter();

const goToSkipRoute = () => router.push({ name: props.skipRoute });
</script>

<style lang="scss" scoped>
.upload-field-input {
  @apply relative rounded-lg border border-dotted border-grey-500/85 cursor-pointer h-20 transition duration-300 ease-in-out hover:bg-green-50 hover:border-green-500;

  label {
    @apply absolute inset-0 w-full h-full text-sm text-grey-600 cursor-pointer flex justify-center items-center;
  }
}

.skip-row {
  @apply text-sm text-grey-600 mt-8;

  span {
    @apply text-green-600/85 font-semibold cursor-pointer transition duration-300 ease-in-out hover:text-green-500/80;
  }
}
</style>
