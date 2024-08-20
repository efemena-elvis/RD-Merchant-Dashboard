<template>
  <ComplianceDisplayBlock
    title="Identify your business signatory"
    description="Provide the identification document of your business signatory."
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    @onBackClick="router.push({ name: 'RedstoneSignatoryProfile' })"
    @onContinueClick="handleSignatoryIdentityUpdate"
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

      <div v-if="selectedDocumentName">
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
            skipRoute="RedstoneSignatoryAddress"
            @onDocumentUploaded="businessPayload.url = $event"
          />
        </div>
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";

type IBusinessType = {
  type: string;
  value: string;
  url: string;
};

const router = useRouter();

const businessPayload = ref<IBusinessType>({
  type: "",
  value: "",
  url: "",
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

const selectedDocumentName = ref<string>("");

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

const handleSignatoryIdentityUpdate = () => {
  // router.push({ name: 'RedstoneSignatoryAddress' })

  console.log("PAYLOAD", getBusinessPayload.value);
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
