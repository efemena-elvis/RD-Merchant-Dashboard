<template>
  <ComplianceDisplayBlock
    title="Identify your business representative"
    description="Provide the identification document of your business representative."
    showActionRow
    @onBackClick="router.push({ name: 'RedstoneRepresentativeProfile' })"
    @onContinueClick="router.push({ name: 'RedstoneRepresentativeAddress' })"
  >
    <div class="content-block mb-10">
      <SelectFieldInput
        labelId="selectDocumentID"
        labelTitle="Select Identification Document"
        inputPlaceholder="Select identification document"
        inputBaseColor="bg-grey-10"
        inputValue=""
        :selectData="documentList"
        isRequired
        @onSelectionChange="handleSelectChange"
      />

      <div v-if="selectedDocumentName">
        <TextFieldInput
          labelId="documentNumber"
          :labelTitle="selectedDocumentName"
          :inputType="IInputType.Text"
          :inputPlaceholder="`Provide ${selectedDocumentName.toLowerCase()} data`"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
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
          <FileUploadInput showSkip skipRoute="RedstoneRepresentativeAddress" />
        </div>
      </div>
    </div>
  </ComplianceDisplayBlock>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@/models/form-type";
import ComplianceDisplayBlock from "@/modules/compliance/components/compliance-display-block.vue";
import SelectFieldInput from "@/shared/components/form-comps/select-field-input.vue";
import TextFieldInput from "@/shared/components/form-comps/text-field-input.vue";
import UploadGuidelines from "@/modules/compliance/components/upload-guidelines.vue";
import FileUploadInput from "@/shared/components/form-comps/file-upload-input.vue";

const router = useRouter();

const documentList = ref<{ value: string; name: string }[]>([
  { value: "drivers_license", name: "Driver's License" },
  {
    value: "national_identification_number",
    name: "National Identification Number",
  },
  { value: "voters_card", name: "Voter's Card" },
  { value: "passport", name: "International Passport" },
]);

const selectedDocument = ref<string>("");
const selectedDocumentName = ref<string>("");

const handleSelectChange = (value: string): void => {
  selectedDocument.value = value;

  const selected = documentList.value.find((doc) => doc.value === value)?.name;

  selectedDocumentName.value = selected ? selected : "";
};
</script>

<style lang="scss" scoped>
.content-block {
  // @apply ;
}
</style>
