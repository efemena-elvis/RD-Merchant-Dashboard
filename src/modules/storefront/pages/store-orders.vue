<template>
  <div class="strorefront-order-page pb-10">
    <!-- TOP AREA -->
    <div class="top-area">
      <div class="top-area--left">
        <div class="form-input-block">
          <div class="icon icon-search-normal"></div>

          <input
            type="search"
            class="form-control form-input"
            placeholder="Search orders..."
          />
        </div>
      </div>
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No orders yet',
        description:
          'You haven\'t received any orders on this storefront yet. This is where you\'ll be able to manage all pending orders',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </div>

  <teleport to="body" v-if="showUpdateOrdersModal">
    <UpdateOrdersModal
      :orderDetails="productOrderDetails"
      @closeTriggered="toggleUpdateOrdersModal"
      @reloadStoreOrders="fetchAllStoreOrders"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { h, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { useStorefrontStore } from "@/modules/storefront/store";
import useEvents from "@/shared/composables/useEvents";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import UpdateOrdersModal from "@/modules/storefront/modals/update-orders-modal.vue";
import TableActionBtn from "@/shared/components/table-comps/table-action-btn.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
import useDate from "@/shared/composables/useDate";

const { getBoldTableText, formatNumber } = useString();

const route = useRoute();
const router = useRouter();

const { getStoreOrders } = useStorefrontStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const getDateAdded = (date: string) => {
  let { m4, d3, y1 } = useDate.formatDate(date).getAll();
  return `${d3} ${m4}, ${y1}`;
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Product Details", slug: "product" },
  { title: "Customer Details", slug: "customer" },
  { title: "Order Details", slug: "order" },
  { title: "Payment", slug: "payment_status" },
  { title: "Order Status", slug: "order_status" },
  { title: "", slug: "action" },
]);

const tableBody = reactive<any[]>([
  {
    counter: "1",
    product: h(TableDoubleColumn, {
      entry: {
        primaryText: "M1 Macbook pro",
        secondaryText: "Electronics",
        displayImage: "https://picsum.photos/200",
      },
    }),
    customer: h(TableDoubleColumn, {
      entry: {
        primaryText: "John Doe",
        secondaryText: "johndoe@example.com",
      },
    }),
    order: h(TableDoubleColumn, {
      entry: {
        primaryText: getBoldTableText(`ZMW ${formatNumber(1245)}`),
        secondaryText: "Quantity: 1",
      },
    }),
    payment_status: h(TableDoubleColumn, {
      entry: {
        primaryText: "Paid",
        secondaryText: "24th Jan, 2025",
      },
    }),
    order_status: "Processing",
    action: h(TableActionBtn, {
      showPrimaryBtn: true,
      showSecondaryBtn: false,
      primaryBtnText: "Manage",
      onManageClick: () => handleOrderStatus(),
    }),
  },
]);
const tablePaging = ref<any>({});

const productOrderDetails = ref<any>({});
const showUpdateOrdersModal = ref(false);

const toggleUpdateOrdersModal = () => {
  showUpdateOrdersModal.value = !showUpdateOrdersModal.value;
};

const fetchAllStoreOrders = async () => {
  const response = await processAPIRequest({
    action: getStoreOrders,
    payload: { storefrontId: route.params.storeId },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    // tableBody.push(
    //   ...response.data.map((data: any) => ({
    //     name: getBoldTableText(data.name),
    //     orders: 0,
    //     revenue: "ZMW 0",
    //     link: createPreviewLink(
    //       `https://store.redstonepgs.com/${data.slug}`,
    //       "Preview storefront"
    //     ),
    //     status: `${getStatus("success", "Active")}`,
    //     action: h(TableActionBtn, {
    //       showPrimaryBtn: true,
    //       showSecondaryBtn: true,
    //       primaryBtnText: "Manage store",
    //       onManageClick: () => router.push(`storefront/overview/${data.id}`),
    //       onDeleteClick: () => handleDeleteStorefront(data),
    //     }),
    //   }))
    // );

    // tablePaging.value = response.pagination[0];
  }
};

const handleOrderStatus = (orderData?: any) => {
  productOrderDetails.value = orderData;
  toggleUpdateOrdersModal();
};

fetchAllStoreOrders();
</script>

<style lang="scss" scoped>
.strorefront-order-page {
  .top-area {
    @apply flex justify-between items-center gap-x-3 mb-11;

    &--left {
      @apply flex flex-col justify-center items-start gap-y-0.5 w-[30%];

      .section-title {
        @apply font-semibold text-base sm:text-[15.5px] text-grey-700;
      }

      .section-description {
        @apply text-grey-600/85 text-[12.5px];
      }
    }

    &--right {
      @apply flex justify-end items-center gap-x-3 sm:hidden;
    }
  }

  .form-input-block {
    @apply relative w-full;

    .form-input {
      @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.5px] pl-10 pr-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
    }

    .icon {
      @apply z-10 text-[15px] absolute top-1/2 left-4 transform -translate-y-1/2 text-grey-600;
    }
  }

  .button-actions {
    @apply w-full;

    .btn {
      @apply w-max h-[46px] py-3 sm:py-3 px-7 text-grey-800/80 border text-[13px];
    }

    .btn-primary {
      @apply text-neutral-10;
    }
  }
}
</style>
