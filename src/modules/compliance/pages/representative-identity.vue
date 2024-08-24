<template>
  <ComplianceDisplayBlock
    title="Identify your business representative"
    description="Provide the identification document of your business representative."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'RedstoneRepresentativeProfile' })"
    @onContinueClick="handleRepresentativeIdentityUpdate"
  >
    <div class="content-block mb-10">
      <SelectFieldInput
        labelId="selectDocumentID"
        labelTitle="Select Identification Document"
        inputPlaceholder="Select identification document"
        inputBaseColor="bg-grey-10"
        :inputValue="businessPayload.type"
        :selectData="documentList"
        isRequired
        @onSelectionChange="handleSelectChange"
      />

      <template v-if="selectedDocumentName">
        <TextFieldInput
          labelId="documentNumber"
          :labelTitle="selectedDocumentName"
          :inputType="IInputType.Text"
          :inputValue="businessPayload.value"
          :inputPlaceholder="`Provide ${selectedDocumentName.toLowerCase()} data`"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          @inputChanged="businessPayload.value = $event"
          :errorHandler="{
            validator: 'validateRequired',
            message: 'Document number is a required field',
          }"
        />

        <div class="mt-12">
          <UploadGuidelines
            title="Please upload documents that:"
            :guidelines="[
              'Is government issued',
              'Is full-sized, original and unedited',
              'Is placed against a single colored background',
              'Is in JPG, JPEG, PNG or PDF file formats',
            ]"
          />
        </div>

        <!-- DOCUMENT FIELD UPLOAD -->
        <div class="mb-14">
          <FileUploadInput
            showSkip
            skipRoute="RedstoneRepresentativeAddress"
            :hasDocumentUploaded="!!uploadedDocument"
            :uploadedDocumentContent="getUploadedDocumentContent"
            @onDocumentUploaded="businessPayload.url = $event"
          />
        </div>
      </template>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";
import { useComplianceUtil } from "../composable/useComplianceUtil";
import { useComplianceStore } from "../store";
import { storeToRefs } from "pinia";

type IBusinessType = {
  type: string;
  value: string;
  url: string;
};

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const { handleComplianceRequest } = useComplianceUtil();
const { getComplianceRepresentative } = storeToRefs(useComplianceStore());

const businessPayload = ref<IBusinessType>({
  type: getComplianceRepresentative.value?.[0]?.doc.type || "",
  value: getComplianceRepresentative.value?.[0]?.doc.value || "",
  url: getComplianceRepresentative.value?.[0]?.doc.url || "",
});

const uploadedDocument = ref<string>(
  getComplianceRepresentative.value?.[0]?.doc.url || ""
);

const getUploadedDocumentContent = computed(() => {
  return {
    name: getComplianceRepresentative.value?.[0].doc.type?.split("_").join(" "),
    link: getComplianceRepresentative.value?.[0].doc.url,
  };
});

const documentList = ref<{ value: string; name: string }[]>([
  { value: "drivers_license", name: "Driver's License" },
  {
    value: "national_identification_number",
    name: "National Identification Number",
  },
  { value: "voters_card", name: "Voter's Card" },
  { value: "passport", name: "International Passport" },
]);

const selectedDocumentName = ref<string>(
  getComplianceRepresentative.value?.[0].doc.type?.split("_").join(" ") || ""
);

const handleSelectChange = (value: string): void => {
  const selected = documentList.value.find((doc) => doc.value === value);

  businessPayload.value.type = selected ? selected.value : "";
  selectedDocumentName.value = selected ? selected.name : "";
};

const isActionReady = computed(() => {
  return businessPayload.value.type &&
    businessPayload.value.value &&
    businessPayload.value.url
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { type, value, url } = businessPayload.value;
  return { doc: { type, value, url } };
});

const handleRepresentativeIdentityUpdate = async () => {
  await handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "RedstoneRepresentativeAddress",
    stopClickHandler,
    succesMsg: "Representative identity submitted",
    errorMsg: "Representative update failed",
    payloadType: "representatives",
  });
};

watch(
  getComplianceRepresentative,
  (newValue) => {
    if (newValue && newValue.length > 0) {
      businessPayload.value = {
        type: newValue[0]?.doc.type || "",
        value: newValue[0]?.doc.value || "",
        url: newValue[0]?.doc.url || "",
      };

      uploadedDocument.value = newValue[0]?.doc.url || "";
      selectedDocumentName.value =
        newValue[0]?.doc.type?.split("_").join(" ") || "";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
