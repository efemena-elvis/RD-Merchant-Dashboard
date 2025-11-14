<template>
  <PageContentWrapper
    searchInputPlaceholder="Search activity logs"
    :filterActiveValue="activePeriod"
    pageDescription="All logged activities"
    :pagingData="tablePaging"
    :pageKeys="{ green: 'Successful logs' }"
    @searchEntered="processSearchEntry"
    @filterSelected="processFilterSelection"
    :hasPayload="tableBody.length > 0"
    :fetchDataByPage="fetchAuditLogs"
  >
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No activity yet',
        description:
          'We haven\'t received any activity on this account yet. This is where you\'ll be able to see all your activities.',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useString } from "@/shared/composables/useString";
import { TableHeaderType } from "@/models/dashboard-type";
import { useSettingsStore } from "../store";
import useDate from "@/shared/composables/useDate";
import useEvents from "@/shared/composables/useEvents";
import PageContentWrapper from "@/shared/components/global-comps/page-content-wrapper.vue";
import TableContainer from "@/shared/components/table-comps/table-container.vue";
import TableContainerBody from "@/shared/components/table-comps/table-container-body.vue";
import TableDoubleColumn from "@/shared/components/table-comps/table-double-column.vue";
import { h } from "vue";

const { getStatus } = useString();
const { getAuditLogs } = useSettingsStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const tableHeader = ref<TableHeaderType[]>([
  { title: "Time Logged", slug: "date_created" },
  { title: "Initiated By", slug: "initiated_by" },
  { title: "Action Type", slug: "action_type" },
  { title: "Activity", slug: "activity" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const searchQuery = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isWithinRange = (date: Date, range: [Date, Date] | null) => {
  if (!range) return true;
  const start = normalizeDate(new Date(range[0]));
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999);
  const target = new Date(date);
  return target >= start && target <= end;
};

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.trim();
};

const processFilterSelection = (
  selectedRange: [Date | string, Date | string]
) => {
  if (selectedRange && selectedRange.length === 2) {
    activePeriod.value = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
  } else {
    activePeriod.value = null;
  }
};

const getUserName = (user: any) =>
  user.first_name ? `${user.first_name} ${user.last_name}` : user.email;

const getActivityDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw.raw_date) : null;

    const matchesDate = rawDate
      ? isWithinRange(rawDate, activePeriod.value)
      : true;

    const matchesSearch =
      !searchQuery.value ||
      (tx.activity || "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

    return matchesDate && matchesSearch;
  });
});

const fetchAuditLogs = async (page = 1) => {
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getAuditLogs,
    payload: { page },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const createdDate = new Date(data.created_at);

      return {
        status: getStatus(data.status ?? "-", data.status ?? "-"),
         date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getActivityDate(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        initiated_by: getUserName(data.user),
        action_type: data.action_type,
        activity: data.activity,
        raw: {
          status: data.status,
          raw_date: createdDate,
          initiated_by: getUserName(data.user),
          action_type: data.action_type,
          activity: data.activity,
        },
      };
    });

    tablePaging.value = response.pagination?.[0] || {};
  }
};

onMounted(() => {
  fetchAuditLogs();
});
</script>

<style lang="scss" scoped></style>
