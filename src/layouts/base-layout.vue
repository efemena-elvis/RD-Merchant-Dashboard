<template>
  <div>
    <div class="base-layout">
      <!-- SIDEBAR AREA -->
      <div
        class="sidebar-area"
        :class="showMobileSidebar && 'visible-sidebar-area'"
      >
        <div class="sidebar-mobile-overlay" @click="toggleMobileSidebar"></div>
        <BaseSidebar />
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="main-content-area">
        <!-- TOPBAR AREA -->
        <div class="topbar-area">
          <!-- ALERT TOP BAR -->
          <AlertTopbar
            v-if="showAlertTop"
            :alertText="alertTopText"
            :alertAction="alertTopActionText"
            :alertActionRoute="alertTopActionRoute"
          />
          <BaseTopbar />
        </div>

        <!-- MAIN CONTENT -->
        <div
          class="main-content"
          :class="
            showAlertTop
              ? 'top-[176px] mdLg:top-[180px]'
              : 'top-28 xl:top-[108px] mdLg:top-[98px]'
          "
        >
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </div>
    </div>

    <a class="support-card" href="#" @click="toggleSupportModal">
      <div class="icon icon-support-icon"></div>
      <div class="text">NEED HELP ?</div>
    </a>
  </div>

  <teleport to="body" v-if="showSupportModal">
    <ContactSupportModal @closeTriggered="toggleSupportModal" />
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useColor } from "@/shared/composables/useColor";
import { useProfile } from "@/shared/composables/useProfile";
import BaseTopbar from "@/shared/components/global-comps/base-topbar.vue";
import AlertTopbar from "@/shared/components/global-comps/alert-topbar.vue";
import BaseSidebar from "@/shared/components/global-comps/base-sidebar.vue";
import { Emitter } from "mitt";
import ContactSupportModal from "@/shared/modals/contact-support-modal.vue";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
};

const route = useRoute();

const { getBusiness, getBusinessActivatedStatus } = useProfile();

const eventBus = inject<Emitter<Events>>("eventBus");
const showMobileSidebar = ref<boolean>(false);

const showAlertTop = ref<boolean>(false);
const alertTopText = ref<string>("");
const alertTopActionText = ref<string>("");
const alertTopActionRoute = ref<string>("");

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};

const showSupportModal = ref(false);

const toggleSupportModal = () => {
  showSupportModal.value = !showSupportModal.value;
};

watch(route, () => {
  if (showMobileSidebar.value) {
    showMobileSidebar.value = false;
  }
});

const { setPageBackgroundColor } = useColor();

onMounted(() => {
  setPageBackgroundColor("#ffffff");

  eventBus?.on("triggerSidebar", () => toggleMobileSidebar());

  getActivationStatus();
});

const getActivationStatus = () => {
  if (getBusinessActivatedStatus() !== "true") {
    showAlertTop.value = true;

    if (getBusiness().activateMyBusiness) {
      alertTopText.value =
        "Your business compliance data is currently in review.";
      alertTopActionText.value = "View compliance";
      alertTopActionRoute.value = "/compliance/compliance-summary";
    } else {
      alertTopText.value = "Complete your business compliance to get activated";
      alertTopActionText.value = "Activate business";
      alertTopActionRoute.value = "/compliance/documents";
    }
  } else showAlertTop.value = false;
};
</script>

<style lang="scss" scoped>
.base-layout {
  @apply w-full flex justify-between items-start;

  .sidebar-area {
    @apply fixed w-[17%] xl:w-[20%] lg:w-[24%] mdLg:w-0 mdLg:hidden h-full top-0 left-0;
  }

  .visible-sidebar-area {
    @apply fixed h-screen w-[35%] md:w-[45%] sm:w-[60%] xs:w-[70%] block z-50 animate-drift-left;
    z-index: 999;

    .sidebar-mobile-overlay {
      @apply fixed inset-0 w-full h-full bg-neutral-900/40 transition duration-300 ease-in-out;
    }
  }

  .main-content-area {
    @apply relative w-[83%] xl:w-[80%] lg:w-[76%] mdLg:w-full left-[17%] xl:left-[20%] lg:left-[24%] mdLg:left-0;

    .topbar-area {
      @apply fixed top-0 w-[83%] xl:w-[80%] lg:w-[76%] mdLg:w-full bg-neutral-10 shadow-sm border;
      z-index: 99;
    }

    .main-content {
      @apply relative mt-3.5 w-full h-full pb-7 px-8 xl:px-6 mdLg:px-4;
    }
  }
}
.support-card {
  @apply fixed z-40 text-white bg-teal-700/95 bottom-7 right-7 scale-[0.85] cursor-pointer rounded-full py-[11px] px-[15px] flex justify-center items-center gap-x-2 transition duration-300 ease-in-out hover:scale-[0.9];

  .icon {
    @apply text-[16px];
  }

  .text {
    @apply text-[13px] text-white font-medium;
  }
}
</style>
