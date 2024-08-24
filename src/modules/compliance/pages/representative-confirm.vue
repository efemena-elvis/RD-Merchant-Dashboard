<template>
  <ComplianceDisplayBlock
    title="Verify your representative address"
    description="Provide the relevant document to confirm your representative residential address."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRepresentativeAddress' })"
    @onContinueClick="handleRepresentativeConfirmUpdate"
  >
    <div class="content-block">
      <UploadGuidelines
        title="Please upload a proof of address that:"
        :guidelines="[
          `Confirm residential address at: <br/> ${businessAddress || '------'}`,
          'Is less than 4 months old either in JPG, JPEG, PNG or PDF',
        ]"
      />

      <UploadGuidelines
        title="We accept any ONE of the following documents:"
        :guidelines="[
          'Bank statement',
          'Utility bills (e.g electricity, water bills)',
          'Signed lease/tenancy agreement',
        ]"
      />

      <SelectFieldInput
        labelId="DocumentType"
        labelTitle="Document Type"
        inputPlaceholder="Select document type"
        :inputValue="businessPayload.type"
        inputBaseColor="bg-grey-10"
        :selectData="documentTypes"
        isRequired
        @onSelectionChange="businessPayload.type = $event"
      />

      <!-- DOCUMENT FIELD UPLOAD -->
      <div class="mb-14">
        <FileUploadInput
          showSkip
          skipRoute="RedstoneBankAccount"
          :hasDocumentUploaded="!!businessPayload.url"
          :uploadedDocumentContent="getUploadedDocumentContent"
          @onDocumentUploaded="businessPayload.url = $event"
        />
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { storeToRefs } from "pinia";
import { useComplianceStore } from "../store";

type IBusinessType = {
  type: string;
  url: string;
};

const router = useRouter();
const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceRepresentative } = storeToRefs(useComplianceStore());

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  type: getComplianceRepresentative.value?.[0]?.address_doc.type || "",
  url: getComplianceRepresentative.value?.[0]?.address_doc.url || "",
});

const computeAddress = computed(() => {
  if (getComplianceRepresentative.value?.[0]?.first_address?.length)
    return getComplianceRepresentative.value?.[0]?.first_address;

  return "----";
});

const businessAddress = ref<string>(computeAddress.value || "");

const getUploadedDocumentContent = computed(() => {
  return {
    name: getComplianceRepresentative.value?.[0]?.address_doc.type
      ?.split("_")
      .join(" "),
    link: getComplianceRepresentative.value?.[0]?.address_doc.url,
  };
});

const documentTypes = ref<{ value: string; name: string }[]>([
  {
    value: "bank_statement",
    name: "Bank statement",
  },
  {
    value: "utility_bills",
    name: "Utility bills",
  },
  {
    value: "tenancy_agreement",
    name: "Signed lease / tenancy agreement",
  },
]);

const isActionReady = computed(() => {
  return businessPayload.value.type && businessPayload.value.url ? false : true;
});

const getBusinessPayload = computed(() => {
  const { type, url } = businessPayload.value;
  return { address_doc: { type, url } };
});

const handleRepresentativeConfirmUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneBankAccount",
    stopClickHandler,
    succesMsg: "Representative address document submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      businessPayload.value = {
        type: newValue[0]?.address_doc.type || "",
        url: newValue[0]?.address_doc.url || "",
      };

      businessAddress.value = newValue[0]?.first_address || "";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
